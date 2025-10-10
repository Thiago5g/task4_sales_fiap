import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn, IsString, IsNumber } from 'class-validator';

export class UpdatePagamentoDto {
  @ApiProperty({
    example: 'PAY-1-A1B2C3',
    description: 'Código único do pagamento gerado na criação da venda',
  })
  @IsString()
  codigoPagamento: string;

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
