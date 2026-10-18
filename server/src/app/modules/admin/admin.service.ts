import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { IQueryParams, IQueryResult } from "../../interfaces/query.interface";

const SORTABLE_FIELDS = ["createdAt", "name", "email"];

const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
};

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

export const AdminService = {
  updateUserStatus,
  deleteUser,
  getAllUsers,
  getUserSummary,
};
