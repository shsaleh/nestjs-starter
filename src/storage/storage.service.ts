import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import { fromBuffer } from 'file-type';
import { FileType } from './fileTypes.enum';
@Injectable()
export class StorageService {
  constructor(
    @Inject('File_REPOSITORY')
    private readonly fileRepository: Repository<File>,
  ) {}
  fileNameAndDiroctoryMaker({
    originalname,
    type,
    userId,
    extention,
  }: {
    originalname: string;
    type: FileType;
    userId: number;
    extention: string;
  }) {
    //todo set base dir from env
    const uploadDir = join(process.env.FILE_UPLOAD_DIR, 'uploads', type);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    return join(
      uploadDir,
      originalname +
        '_' +
        new Date().getTime() +
        '_' +
        userId +
        '.' +
        extention,
    );
  }
  async upload(
    file: Express.Multer.File,
    type: FileType,
    user?: User,
  ): Promise<File> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const extention = (await fromBuffer(file.buffer)).ext;
    const filePath = this.fileNameAndDiroctoryMaker({
      originalname: file.originalname,
      type: type,
      userId: user.id,
      extention: extention,
    });
    const writeStream = createWriteStream(filePath);

    writeStream.write(file.buffer);
    writeStream.end();

    const fileUrl = filePath;

    const newFile = this.fileRepository.create({
      name: file.originalname,
      url: fileUrl,
      type,
      user,
      extention,
    });

    try {
      return await this.fileRepository.save(newFile);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save file information to the database',
      );
    }
  }

  async findAllBy(where: FindOptionsWhere<File>): Promise<File[]> {
    return await this.fileRepository.findBy(where);
  }

  async findOne(
    file: Partial<File>,
    where: FindOneOptions<File> = {},
  ): Promise<File> {
    const foundFile = this.fileRepository.findOne({
      where: { ...file },
      ...where,
    });

    if (!foundFile) {
      throw new NotFoundException('File not found');
    }

    return foundFile;
  }

  async delete(file: File): Promise<void> {
    const foundFile = await this.findOne({ id: file.id });
    const filePath = foundFile.url;

    try {
      // Delete file from disk
      unlinkSync(filePath);
      // Delete from database
      await this.fileRepository.delete(foundFile);
    } catch (error) {
      // Handle potential errors during deletion (file system, database)
      if (error.code === 'ENOENT') {
        // File not found on disk, log or handle gracefully
        console.error(`File not found on disk: ${filePath}`);
      } else {
        throw new InternalServerErrorException(
          'Failed to delete file or information from the database',
        );
      }
    }
  }
}
