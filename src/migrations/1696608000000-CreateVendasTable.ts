import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateVendasTable1696608000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'vendas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cliente_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'veiculo_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'preco',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'data_venda',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        indices: [
          {
            name: 'IDX_VENDAS_CLIENTE_ID',
            columnNames: ['cliente_id'],
          },
          {
            name: 'IDX_VENDAS_VEICULO_ID',
            columnNames: ['veiculo_id'],
          },
          {
            name: 'IDX_VENDAS_DATA_VENDA',
            columnNames: ['data_venda'],
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('vendas');
  }
}
