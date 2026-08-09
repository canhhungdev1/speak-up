import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString({ message: 'idToken phải là dạng chuỗi string' })
  @IsNotEmpty({ message: 'idToken không được để trống' })
  idToken!: string;
}
