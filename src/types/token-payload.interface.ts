import { UserRole } from "generated/prisma";

export interface TokenPayload {
  userId: number;
  role: UserRole;
}
