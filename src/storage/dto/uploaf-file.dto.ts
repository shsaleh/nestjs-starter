import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  type: string;
}
