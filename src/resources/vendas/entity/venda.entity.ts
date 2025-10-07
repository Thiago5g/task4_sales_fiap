import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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

  @Column({ name: 'preco' })
  @ApiProperty({ example: 142.75 })
  preco: number;

  @CreateDateColumn({ name: 'data_venda' })
  @ApiProperty({ example: '2025-06-22T14:33:05.000Z' })
  dataVenda: Date;
}
