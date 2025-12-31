import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { File } from './file.entity';
import { AbilityFactory } from '../../common/casl/ability.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
    }),
  ],
  controllers: [FileController],
  providers: [FileService, AbilityFactory],
  exports: [FileService, AbilityFactory],
})
export class FileModule {}
