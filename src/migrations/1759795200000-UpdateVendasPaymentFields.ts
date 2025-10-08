import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class UpdateVendasPaymentFields1759795200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const oldDateIndexName = 'IDX_VENDAS_DATA_VENDA';
    const tableForIndexCheck = await queryRunner.getTable('vendas');
    const indices = tableForIndexCheck ? tableForIndexCheck.indices : [];
    const hasOldDateIndex = indices.some((i) => i.name === oldDateIndexName);
    if (hasOldDateIndex) {
      await queryRunner.dropIndex('vendas', oldDateIndexName);
    }

    // Renomear colunas existentes
    const table = await queryRunner.getTable('vendas');
    if (table) {
      const precoColumn = table.findColumnByName('preco');
      if (precoColumn) {
        await queryRunner.renameColumn('vendas', 'preco', 'amount');
      }
      const dataVendaColumn = table.findColumnByName('data_venda');
      if (dataVendaColumn) {
        await queryRunner.renameColumn('vendas', 'data_venda', 'created_at');
      }
    }

    // Adicionar novas colunas
    await queryRunner.addColumns('vendas', [
      new TableColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        isNullable: false,
      }),
      new TableColumn({
        name: 'currency',
        type: 'varchar',
        length: '3',
        default: "'BRL'",
        isNullable: false,
      }),
      new TableColumn({
        name: 'payment_code',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
      new TableColumn({
        name: 'status',
        type: 'varchar',
        length: '20',
        default: "'PENDING_PAYMENT'",
        isNullable: false,
      }),
      new TableColumn({
        name: 'payment_status',
        type: 'varchar',
        length: '15',
        default: "'PENDING'",
        isNullable: false,
      }),
      new TableColumn({
        name: 'paid_at',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'sold_at',
        type: 'timestamp',
        isNullable: true,
      }),
    ]);

    // Criar novos índices
    await queryRunner.createIndex(
      'vendas',
      new TableIndex({
        name: 'IDX_VENDAS_CREATED_AT',
        columnNames: ['created_at'],
      }),
    );

    await queryRunner.createIndex(
      'vendas',
      new TableIndex({
        name: 'IDX_VENDAS_PAYMENT_CODE',
        columnNames: ['payment_code'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índices novos
    const tableForDown = await queryRunner.getTable('vendas');
    const downIndices = tableForDown ? tableForDown.indices : [];
    if (downIndices.some((i) => i.name === 'IDX_VENDAS_PAYMENT_CODE')) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_PAYMENT_CODE');
    }
    if (downIndices.some((i) => i.name === 'IDX_VENDAS_CREATED_AT')) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_CREATED_AT');
    }

    // Remover colunas adicionadas
    const columnsToDrop = [
      'updated_at',
      'currency',
      'payment_code',
      'status',
      'payment_status',
      'paid_at',
      'sold_at',
    ];
    for (const col of columnsToDrop) {
      const table = await queryRunner.getTable('vendas');
      if (table?.findColumnByName(col)) {
        await queryRunner.dropColumn('vendas', col);
      }
    }

    // Renomear colunas de volta
    const tableAfter = await queryRunner.getTable('vendas');
    if (tableAfter) {
      if (tableAfter.findColumnByName('amount')) {
        await queryRunner.renameColumn('vendas', 'amount', 'preco');
      }
      if (tableAfter.findColumnByName('created_at')) {
        await queryRunner.renameColumn('vendas', 'created_at', 'data_venda');
      }
    }

    // Restaurar índice antigo baseado em data_venda
    await queryRunner.createIndex(
      'vendas',
      new TableIndex({
        name: 'IDX_VENDAS_DATA_VENDA',
        columnNames: ['data_venda'],
      }),
    );
  }
}
