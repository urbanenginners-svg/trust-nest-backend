import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import {
  UploadFileSwagger,
  CreateFileSwagger,
  FindAllFilesSwagger,
  FindOneFileSwagger,
  UpdateFileSwagger,
  RemoveFileSwagger,
  DownloadFileSwagger,
} from './decorators/file.swagger.decorator';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  SerializeResponse,
  SerializationGroups,
} from '../../common/decorators/serialize-response.decorator';
import { Action } from '../../common/casl/ability.factory';
import { File, FileModuleName } from './file.entity';
import { User } from '../user/user.entity';

/**
 * File Controller
 * Handles HTTP requests for file-related operations
 */
@ApiTags('files')
@ApiBearerAuth('defaultBearerAuth')
@Controller('files')
@UseGuards(AuthGuard, PermissionsGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * Upload a file
   * POST /files/upload
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @CheckPermissions({ action: Action.CREATE, subject: File })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @UploadFileSwagger()
  @SerializeResponse('admin', 'user')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
    @Query('moduleName') moduleName?: FileModuleName,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return await this.fileService.uploadFile(file, user.id, moduleName);
  }

  /**
   * Download a file
   * GET /files/:id/download
   */
  @Get(':id/download')
  @CheckPermissions({ action: Action.READ, subject: File })
  @DownloadFileSwagger()
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const { buffer, file } = await this.fileService.getFileContent(id);

    res.set({
      'Content-Type': file.fileType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
      'Content-Length': file.fileSize.toString(),
    });

    res.send(buffer);
  }

  /**
   * Create file metadata
   * POST /files
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CheckPermissions({ action: Action.CREATE, subject: File })
  @CreateFileSwagger()
  @SerializeResponse('admin')
  async create(@Body() createFileDto: CreateFileDto) {
    return await this.fileService.create(createFileDto);
  }

  /**
   * Get all files
   * GET /files
   */
  @Get()
  @CheckPermissions({ action: Action.READ, subject: File })
  @FindAllFilesSwagger()
  @SerializeResponse('admin', 'user')
  async findAll(
    @Query('moduleName') moduleName?: FileModuleName,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    if (moduleName) {
      return await this.fileService.findByModule(moduleName, includeDeleted);
    }
    return await this.fileService.findAll(includeDeleted);
  }

  /**
   * Get files by uploader
   * GET /files/my-files
   */
  @Get('my-files')
  @CheckPermissions({ action: Action.READ, subject: File })
  @FindAllFilesSwagger()
  @SerializeResponse('admin', 'user')
  async getMyFiles(
    @CurrentUser() user: User,
    @Query('includeDeleted') includeDeleted?: boolean,
  ) {
    return await this.fileService.findByUploader(user.id, includeDeleted);
  }

  /**
   * Get file by ID
   * GET /files/:id
   */
  @Get(':id')
  @CheckPermissions({ action: Action.READ, subject: File })
  @FindOneFileSwagger()
  @SerializeResponse('admin', 'user')
  async findOne(@Param('id') id: string) {
    return await this.fileService.findOne(id);
  }

  /**
   * Update file metadata by ID
   * PATCH /files/:id
   */
  @Patch(':id')
  @CheckPermissions({ action: Action.UPDATE, subject: File })
  @UpdateFileSwagger()
  @SerializeResponse('admin', 'user')
  async update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return await this.fileService.update(id, updateFileDto);
  }

  /**
   * Soft delete file by ID
   * DELETE /files/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermissions({ action: Action.DELETE, subject: File })
  @RemoveFileSwagger()
  async remove(@Param('id') id: string) {
    return await this.fileService.remove(id);
  }

  /**
   * Restore soft-deleted file by ID
   * PUT /files/:id/restore
   */
  @Put(':id/restore')
  @HttpCode(HttpStatus.OK)
  @CheckPermissions({ action: Action.UPDATE, subject: File })
  async restore(@Param('id') id: string) {
    await this.fileService.restore(id);
    return { message: 'File restored successfully' };
  }

  /**
   * Hard delete file (removes from disk)
   * DELETE /files/:id/hard
   */
  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @CheckPermissions({ action: Action.DELETE, subject: File })
  @RemoveFileSwagger()
  async hardDelete(@Param('id') id: string) {
    return await this.fileService.hardDelete(id);
  }
}
