import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SampleProductService } from './sample-product.service';
import { CreateSampleProductDto } from './dto/create-sample-product.dto';
import { UpdateSampleProductDto } from './dto/update-sample-product.dto';
import { SampleProductSwagger } from './decorators/sample-product.swagger.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CheckPermissions } from '../../common/decorators/check-permissions.decorator';
import { Action } from '../../common/casl/ability.factory';
import {
  SerializeResponse,
  SerializationGroups,
} from '../../common/decorators/serialize-response.decorator';
import { SampleProduct } from './sample-product.entity';

/**
 * Sample Product Controller
 * Handles HTTP requests for sample product management
 */
@ApiTags('Sample Products')
@Controller('sample-products')
@UseGuards(AuthGuard, PermissionsGuard)
export class SampleProductController {
  constructor(private readonly sampleProductService: SampleProductService) {}

  /**
   * Create a new sample product
   */
  @Post()
  @SampleProductSwagger.Create()
  @CheckPermissions({ action: Action.CREATE, subject: SampleProduct })
  @SerializeResponse(SerializationGroups.ADMIN)
  async create(@Body() createSampleProductDto: CreateSampleProductDto) {
    return await this.sampleProductService.create(createSampleProductDto);
  }

  /**
   * Get all sample products
   */
  @Get()
  @SampleProductSwagger.FindAll()
  @CheckPermissions({ action: Action.READ, subject: SampleProduct })
  @SerializeResponse(SerializationGroups.USER)
  async findAll(
    @Query('includeInactive') includeInactive?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    const includeInactiveFlag = includeInactive === 'true';
    const includeDeletedFlag = includeDeleted === 'true';
    return await this.sampleProductService.findAll(
      includeInactiveFlag,
      includeDeletedFlag,
    );
  }

  /**
   * Get a specific sample product by ID
   */
  @Get(':id')
  @SampleProductSwagger.FindOne()
  @CheckPermissions({ action: Action.READ, subject: SampleProduct })
  @SerializeResponse(SerializationGroups.USER)
  async findOne(@Param('id') id: string) {
    return await this.sampleProductService.findOne(id);
  }

  /**
   * Update a sample product
   */
  @Patch(':id')
  @SampleProductSwagger.Update()
  @CheckPermissions({ action: Action.UPDATE, subject: SampleProduct })
  @SerializeResponse(SerializationGroups.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateSampleProductDto: UpdateSampleProductDto,
  ) {
    return await this.sampleProductService.update(id, updateSampleProductDto);
  }

  /**
   * Soft delete a sample product
   */
  @Delete(':id')
  @SampleProductSwagger.Remove()
  @CheckPermissions({ action: Action.DELETE, subject: SampleProduct })
  async remove(@Param('id') id: string) {
    await this.sampleProductService.remove(id);
    return { message: 'Sample product soft deleted successfully' };
  }

  /**
   * Restore a soft deleted sample product
   */
  @Put(':id/restore')
  @SampleProductSwagger.Restore()
  @CheckPermissions({ action: Action.UPDATE, subject: SampleProduct })
  async restore(@Param('id') id: string) {
    await this.sampleProductService.restore(id);
    return { message: 'Sample product restored successfully' };
  }
}
