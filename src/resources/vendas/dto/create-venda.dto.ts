import { IsNumber, IsString, Length, IsOptional } from 'class-validator';
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

  @ApiProperty({
    example: 'BRL',
    required: false,
    description: 'Moeda (default BRL)',
  })
  @IsString()
  @Length(3, 3)
  @IsOptional()
  moeda?: string = 'BRL';
}
