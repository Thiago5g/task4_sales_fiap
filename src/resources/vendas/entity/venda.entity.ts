import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'vendas' })
export class Venda {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ name: 'cliente_id' })
  @ApiProperty({ example: 1 })
  clienteId: number;

  @Column({ name: 'veiculo_id' })
  @ApiProperty({ example: 42 })
  veiculoId: number;

  @Column({ name: 'preco', type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ example: 142.75 })
  preco: number;

  @Column({ name: 'moeda', length: 3, default: 'BRL' })
  @ApiProperty({ example: 'BRL' })
  moeda: string;

  @Index('IDX_VENDAS_CODIGO_PAGAMENTO', { unique: true })
  @Column({
    name: 'codigo_pagamento',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  @ApiProperty({ example: 'PAY-1-A1B2C3' })
  codigoPagamento: string | null;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 30,
    default: 'AGUARDANDO_PAGAMENTO',
  })
  @ApiProperty({ example: 'AGUARDANDO_PAGAMENTO' })
  status: 'AGUARDANDO_PAGAMENTO' | 'VENDIDO' | 'CANCELADO';

  @Column({
    name: 'status_pagamento',
    type: 'varchar',
    length: 15,
    default: 'PENDENTE',
  })
  @ApiProperty({ example: 'PENDENTE' })
  statusPagamento: 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'FALHOU';

  @Column({ name: 'pago_em', type: 'timestamp', nullable: true })
  @ApiProperty({ example: '2025-06-22T14:40:05.000Z', required: false })
  pagoEm: Date | null;

  @Column({ name: 'vendido_em', type: 'timestamp', nullable: true })
  @ApiProperty({ example: '2025-06-22T14:40:05.000Z', required: false })
  vendidoEm: Date | null;

  @CreateDateColumn({ name: 'criado_em' })
  @ApiProperty({ example: '2025-06-22T14:33:05.000Z' })
  criadoEm: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  @ApiProperty({ example: '2025-06-22T15:00:05.000Z' })
  atualizadoEm: Date;
}
