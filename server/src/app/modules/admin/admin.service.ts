import status from "http-status";
import { InvoiceStatus, Role, UserStatus } from "../../../generated/prisma";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";
import { userSelect } from "./admin.interface";
import { SORTABLE_FIELDS } from "./admin.constants";
import { satsToBch } from "../invoice/invoice.utils";


const getTargetUser = async (adminId: string, targetId: string) => {
  if (adminId === targetId) {
    throw new AppError(
      status.BAD_REQUEST,
      "You cannot change your own account.",
    );
  }
  const target = await prisma.user.findUnique({ where: { id: targetId } });
  if (!target || target.isDeleted) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }
  if (target.role === Role.ADMIN) {
    throw new AppError(status.FORBIDDEN, "You cannot change another admin.");
  }
  return target;
};

const updateUserStatus = async (
  adminId: string,
  targetId: string,
  newStatus: UserStatus,
) => {
  await getTargetUser(adminId, targetId);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: targetId },
      data: { status: newStatus },
      select: { id: true, name: true, email: true, status: true },
    });
    if (newStatus === UserStatus.BLOCKED) {
      await tx.session.deleteMany({ where: { userId: targetId } });
    }
    return user;
  });
};

const deleteUser = async (adminId: string, targetId: string) => {
  await getTargetUser(adminId, targetId);

  return prisma.$transaction(async (tx) => {
    await tx.session.deleteMany({ where: { userId: targetId } });
    return tx.user.update({
      where: { id: targetId },
      data: {
        status: UserStatus.DELETED,
        isDeleted: true,
        deletedAt: new Date(),
      },
      select: { id: true, email: true, status: true },
    });
  });
};

const getAllUsers = async (query: IQueryParams) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortBy = SORTABLE_FIELDS.includes(query.sortBy ?? "")
    ? (query.sortBy as string)
    : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const where: Record<string, unknown> = {};

  if (query.status) {
    if (!Object.values(UserStatus).includes(query.status as UserStatus)) {
      throw new AppError(status.BAD_REQUEST, "Invalid status filter.");
    }
    where.status = query.status;
  } else {
    where.isDeleted = false;
  }

  if (query.role) {
    if (!Object.values(Role).includes(query.role as Role)) {
      throw new AppError(status.BAD_REQUEST, "Invalid role filter.");
    }
    where.role = query.role;
  }

  if (query.searchTerm) {
    where.OR = [
      { name: { contains: query.searchTerm, mode: "insensitive" } },
      { email: { contains: query.searchTerm, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  const result: IQueryResult<(typeof data)[number]> = {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
  return result;
};

const getUserSummary = async () => {
  const grouped = await prisma.user.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const countOf = (s: UserStatus) =>
    grouped.find((g) => g.status === s)?._count._all ?? 0;

  const active = countOf(UserStatus.ACTIVE);
  const blocked = countOf(UserStatus.BLOCKED);
  const deleted = countOf(UserStatus.DELETED);

  return { total: active + blocked + deleted, active, blocked, deleted };
};


//* new
const getAllInvoices = async (query: IQueryParams) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  const where: Record<string, unknown> = {};

  if (query.status) {
    if (!Object.values(InvoiceStatus).includes(query.status as InvoiceStatus)) {
      throw new AppError(status.BAD_REQUEST, "Invalid status filter.");
    }
    where.status = query.status;
  }

  if (query.searchTerm) {
    const term = query.searchTerm;
    where.OR = [
      { id: { contains: term } },
      { txid: { contains: term } },
      { payAddress: { contains: term } },
      { user: { email: { contains: term, mode: "insensitive" } } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.invoice.count({ where }),
  ]);

  const data = rows.map((i) => ({
    id: i.id,
    feature: i.feature,
    status: i.status,
    priceUsdCents: i.priceUsdCents,
    amountSats: i.amountSats.toString(),
    payAddress: i.payAddress,
    txid: i.txid,
    paidAt: i.paidAt,
    expiresAt: i.expiresAt,
    createdAt: i.createdAt,
    user: i.user,
  }));

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const getStats = async () => {
  const [users, invoiceGroups, revenue, usage] = await Promise.all([
    getUserSummary(),
    prisma.invoice.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.invoice.aggregate({
      where: { status: { in: [InvoiceStatus.PAID, InvoiceStatus.COMPLETED] } },
      _count: { _all: true },
      _sum: { amountSats: true, priceUsdCents: true },
    }),
    prisma.usage.aggregate({ _count: { _all: true }, _sum: { tokens: true } }),
  ]);

  const countOf = (s: InvoiceStatus) =>
    invoiceGroups.find((g) => g.status === s)?._count._all ?? 0;
  const sats = revenue._sum.amountSats ?? 0n;
  const cents = revenue._sum.priceUsdCents ?? 0;

  return {
    users,
    invoices: {
      total: invoiceGroups.reduce((n, g) => n + g._count._all, 0),
      pending: countOf(InvoiceStatus.PENDING),
      paid: countOf(InvoiceStatus.PAID),
      completed: countOf(InvoiceStatus.COMPLETED),
      expired: countOf(InvoiceStatus.EXPIRED),
      underpaid: countOf(InvoiceStatus.UNDERPAID),
    },
    revenue: {
      paidInvoices: revenue._count._all,
      sats: sats.toString(),
      bch: satsToBch(sats),
      usd: (cents / 100).toFixed(2),
    },
    ai: { totalUses: usage._count._all, totalTokens: usage._sum.tokens ?? 0 },
  };
};

export const AdminService = {
  updateUserStatus,
  deleteUser,
  getAllUsers,
  getUserSummary,
  getAllInvoices,
  getStats,
};
