import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File, FileModuleName } from './file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly uploadPath = 'uploads'; // Base upload directory

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {
    // Ensure upload directory exists
    this.ensureUploadDirectoryExists();
  }

  /**
   * Upload a file and save metadata to database
   */
  async uploadFile(
    file: Express.Multer.File,
    uploaderId: string,
    moduleName?: FileModuleName,
  ): Promise<File> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const moduleFolder = moduleName || FileModuleName.GENERAL;
      const relativePath = path.join(this.uploadPath, moduleFolder);
      const fullPath = path.join(process.cwd(), relativePath);
      const filePath = path.join(fullPath, uniqueFileName);

      // Ensure module directory exists
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create file metadata
      const fileEntity = this.fileRepository.create({
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        uploaderId,
        filePath: path.join(relativePath, uniqueFileName).replace(/\\/g, '/'), // Store relative path with forward slashes
        moduleName: moduleFolder,
      });

      return await this.fileRepository.save(fileEntity);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload file: ${error.message}`,
      );
    }
  }

  /**
   * Create file metadata (for files uploaded externally)
   */
  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = this.fileRepository.create(createFileDto);
    return await this.fileRepository.save(file);
  }

  /**
   * Get all files
   */
  async findAll(includeDeleted: boolean = false): Promise<File[]> {
    return await this.fileRepository.find({
      relations: ['uploader'],
      order: { uploadDate: 'DESC' },
      withDeleted: includeDeleted,
    });
  }

  /**
   * Get files by module
   */
  async findByModule(
    moduleName: FileModuleName,
    includeDeleted: boolean = false,
  ): Promise<File[]> {
    return await this.fileRepository.find({
      where: { moduleName },
      relations: ['uploader'],
      order: { uploadDate: 'DESC' },
      withDeleted: includeDeleted,
    });
  }

  /**
   * Get files by uploader
   */
  async findByUploader(
    uploaderId: string,
    includeDeleted: boolean = false,
  ): Promise<File[]> {
    return await this.fileRepository.find({
      where: { uploaderId },
      relations: ['uploader'],
      order: { uploadDate: 'DESC' },
      withDeleted: includeDeleted,
    });
  }

  /**
   * Get file by ID
   */
  async findOne(id: string, includeDeleted: boolean = false): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: { id },
      relations: ['uploader'],
      withDeleted: includeDeleted,
    });

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    return file;
  }

  /**
   * Update file metadata
   */
  async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
    const file = await this.findOne(id);
    Object.assign(file, updateFileDto);
    return await this.fileRepository.save(file);
  }

  /**
   * Soft delete file
   */
  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);
    await this.fileRepository.softDelete(id);
  }

  /**
   * Restore soft-deleted file
   */
  async restore(id: string): Promise<void> {
    const file = await this.findOne(id, true);
    await this.fileRepository.restore(id);
  }

  /**
   * Hard delete file (removes from database and disk)
   */
  async hardDelete(id: string): Promise<void> {
    const file = await this.findOne(id, true); // Include soft-deleted files

    // Delete physical file
    const fullPath = path.join(process.cwd(), file.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from database permanently
    await this.fileRepository.delete(id);
  }

  /**
   * Get file content for download
   */
  async getFileContent(id: string): Promise<{ buffer: Buffer; file: File }> {
    const file = await this.findOne(id);
    const fullPath = path.join(process.cwd(), file.filePath);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('Physical file not found on server');
    }

    const buffer = fs.readFileSync(fullPath);
    return { buffer, file };
  }

  /**
   * Ensure upload directory exists
   */
  private ensureUploadDirectoryExists(): void {
    const uploadDir = path.join(process.cwd(), this.uploadPath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  }
}
