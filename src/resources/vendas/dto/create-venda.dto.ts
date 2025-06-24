import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendaDto {
  @ApiProperty({ example: '12345678900' })
  @IsString()
  cpf: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  veiculoId: number;
}
