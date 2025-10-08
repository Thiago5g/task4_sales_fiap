import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsIn, IsString } from 'class-validator';

export class UpdatePagamentoDto {
  @ApiProperty({
    example: 42,
    description: 'ID do veículo relacionado à venda',
  })
  @IsNumber()
  veiculoId: number;

  @ApiProperty({
    example: 'PAGO',
    description: 'Novo status do pagamento',
    enum: ['PENDENTE', 'PAGO', 'CANCELADO', 'FALHOU'],
  })
  @IsString()
  @IsIn(['PENDENTE', 'PAGO', 'CANCELADO', 'FALHOU'])
  statusPagamento: 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'FALHOU';

  @ApiProperty({
    example: 199.9,
    required: false,
    description:
      'Atualizar o preço (caso tenha ajuste de valor final recebido)',
  })
  @IsOptional()
  @IsNumber()
  preco?: number;
}
