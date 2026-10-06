import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
