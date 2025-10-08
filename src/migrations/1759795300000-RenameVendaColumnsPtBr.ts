import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

// Renomeia colunas de inglês para português na tabela 'vendas'
// amount->valor, currency->moeda, payment_code->codigo_pagamento, payment_status->status_pagamento,
// paid_at->pago_em, sold_at->vendido_em, created_at->criado_em, updated_at->atualizado_em
// Também renomeia índices associados.
export class RenameVendaColumnsPtBr1759795300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('vendas');
    if (!table) return;

    // Remover índices antigos
    const idxCreated = table.indices.find(
      (i) => i.name === 'IDX_VENDAS_CREATED_AT',
    );
    if (idxCreated) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_CREATED_AT');
    }
    const idxPaymentCode = table.indices.find(
      (i) => i.name === 'IDX_VENDAS_PAYMENT_CODE',
    );
    if (idxPaymentCode) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_PAYMENT_CODE');
    }

    const rename = async (from: string, to: string) => {
      if (table.findColumnByName(from)) {
        await queryRunner.renameColumn('vendas', from, to);
      }
    };

    await rename('amount', 'valor');
    await rename('currency', 'moeda');
    await rename('payment_code', 'codigo_pagamento');
    await rename('payment_status', 'status_pagamento');
    await rename('paid_at', 'pago_em');
    await rename('sold_at', 'vendido_em');
    await rename('created_at', 'criado_em');
    await rename('updated_at', 'atualizado_em');

    // Criar novos índices
    await queryRunner.createIndex(
      'vendas',
      new TableIndex({
        name: 'IDX_VENDAS_CRIADO_EM',
        columnNames: ['criado_em'],
      }),
    );
    await queryRunner.createIndex(
      'vendas',
      new TableIndex({
        name: 'IDX_VENDAS_CODIGO_PAGAMENTO',
        columnNames: ['codigo_pagamento'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('vendas');
    if (!table) return;

    // Remover novos índices
    if (table.indices.find((i) => i.name === 'IDX_VENDAS_CODIGO_PAGAMENTO')) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_CODIGO_PAGAMENTO');
    }
    if (table.indices.find((i) => i.name === 'IDX_VENDAS_CRIADO_EM')) {
      await queryRunner.dropIndex('vendas', 'IDX_VENDAS_CRIADO_EM');
    }

    const rename = async (from: string, to: string) => {
      if (table.findColumnByName(from)) {
        await queryRunner.renameColumn('vendas', from, to);
      }
    };

    await rename('valor', 'amount');
    await rename('moeda', 'currency');
    await rename('codigo_pagamento', 'payment_code');
    await rename('status_pagamento', 'payment_status');
    await rename('pago_em', 'paid_at');
    await rename('vendido_em', 'sold_at');
    await rename('criado_em', 'created_at');
    await rename('atualizado_em', 'updated_at');

    // Restaurar índices antigos
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
}
