import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateWaitlistDto {
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Họ tên phải là chuỗi ký tự' })
  @IsOptional()
  fullName?: string;
}
