import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { SharedControllersSwaggerConstants } from '@shared/infrastructure/ui/controllers/constants/controllers.swagger.constants';
import { SharedErrorMessagesConstants } from '@shared/domain/models/constants';

/**
 * Base class for HTTP pagination requests.
 */
export class HttpBasePaginationRequest {
  @ApiPropertyOptional({
    description: SharedControllersSwaggerConstants.PAGE_PARAM_DESCRIPTION,
    minimum: 1,
    type: Number,
  })
  @IsPositive({
    message: SharedErrorMessagesConstants.PAGE_MUST_BE_POSITIVE,
  })
  @IsInt({
    message: SharedErrorMessagesConstants.PAGE_MUST_BE_INTEGER,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: SharedErrorMessagesConstants.PAGE_MUST_BE_NUMBER,
    },
  )
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: SharedControllersSwaggerConstants.LIMIT_PARAM_DESCRIPTION,
    minimum: 1,
    type: Number,
  })
  @IsPositive({
    message: SharedErrorMessagesConstants.LIMIT_MUST_BE_POSITIVE,
  })
  @IsInt({
    message: SharedErrorMessagesConstants.LIMIT_MUST_BE_INTEGER,
  })
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: SharedErrorMessagesConstants.LIMIT_MUST_BE_NUMBER,
    },
  )
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
