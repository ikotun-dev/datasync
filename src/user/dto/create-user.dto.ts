import { IsString } from "class-validator";

//This would work for both finding and creating a user
export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    firebaseUid: string
}
