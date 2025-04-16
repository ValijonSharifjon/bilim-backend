import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  adminId: string;
  @IsEnum(UserRole)
  role: UserRole;
}
