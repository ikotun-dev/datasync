import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../entities/user.entity";

//This would work for both finding and creating a user
export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    firebaseUid: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
