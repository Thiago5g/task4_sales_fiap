import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UserConfigDto {
  @ApiProperty()
  @IsNumber()
  capital: number;

  @ApiProperty()
  @IsNumber()
  dailyRisk: number;

  @ApiProperty()
  @IsNumber()
  maxManagements: number;

  @ApiProperty()
  @IsNumber()
  maxLossManagements: number;
}
