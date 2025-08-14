import { UserRole } from 'generated/prisma';
import { Roles } from './roles.decorator';

export const AdminOnly = () => Roles(UserRole.ADMIN);
