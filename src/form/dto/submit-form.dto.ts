import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

// DTO for User A's form submission
export class SubmitFormDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  noOfUsers: number;

  @IsNumber()
  @Min(1)
  noOfProducts: number;
}
