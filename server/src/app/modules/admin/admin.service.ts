import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";

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

export const AdminService = { updateUserStatus, deleteUser };
