import { MigrationInterface, QueryRunner } from 'typeorm';

// Converte valores de status/status_pagamento para PT-BR e ajusta defaults
export class TranslateStatusValuesPtBr1759795400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Atualizar valores existentes (idempotente caso já estejam traduzidos)
    await queryRunner.query(
      "UPDATE vendas SET status = 'AGUARDANDO_PAGAMENTO' WHERE status = 'PENDING_PAYMENT'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status = 'VENDIDO' WHERE status = 'SOLD'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status = 'CANCELADO' WHERE status = 'CANCELED'",
    );

    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'PENDENTE' WHERE status_pagamento = 'PENDING'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'PAGO' WHERE status_pagamento = 'PAID'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'CANCELADO' WHERE status_pagamento = 'CANCELED'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'FALHOU' WHERE status_pagamento = 'FAILED'",
    );

    // Ajustar defaults (PostgreSQL)
    await queryRunner.query(
      "ALTER TABLE vendas ALTER COLUMN status SET DEFAULT 'AGUARDANDO_PAGAMENTO'",
    );
    await queryRunner.query(
      "ALTER TABLE vendas ALTER COLUMN status_pagamento SET DEFAULT 'PENDENTE'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter valores para inglês
    await queryRunner.query(
      "UPDATE vendas SET status = 'PENDING_PAYMENT' WHERE status = 'AGUARDANDO_PAGAMENTO'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status = 'SOLD' WHERE status = 'VENDIDO'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status = 'CANCELED' WHERE status = 'CANCELADO'",
    );

    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'PENDING' WHERE status_pagamento = 'PENDENTE'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'PAID' WHERE status_pagamento = 'PAGO'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'CANCELED' WHERE status_pagamento = 'CANCELADO'",
    );
    await queryRunner.query(
      "UPDATE vendas SET status_pagamento = 'FAILED' WHERE status_pagamento = 'FALHOU'",
    );

    // Restaurar defaults
    await queryRunner.query(
      "ALTER TABLE vendas ALTER COLUMN status SET DEFAULT 'PENDING_PAYMENT'",
    );
    await queryRunner.query(
      "ALTER TABLE vendas ALTER COLUMN status_pagamento SET DEFAULT 'PENDING'",
    );
  }
}
