import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendaDto {
  @ApiProperty({ example: 3 })
  @IsNumber()
  clienteId: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  veiculoId: number;

  @ApiProperty({ example: 145.95 })
  @IsNumber()
  preco: number;
}
