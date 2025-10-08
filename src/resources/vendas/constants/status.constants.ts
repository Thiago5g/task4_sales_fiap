export const STATUS_VENDA = {
  AGUARDANDO_PAGAMENTO: 'AGUARDANDO_PAGAMENTO',
  VENDIDO: 'VENDIDO',
  CANCELADO: 'CANCELADO',
} as const;

export type StatusVenda = (typeof STATUS_VENDA)[keyof typeof STATUS_VENDA];

export const STATUS_PAGAMENTO = {
  PENDENTE: 'PENDENTE',
  PAGO: 'PAGO',
  CANCELADO: 'CANCELADO',
  FALHOU: 'FALHOU',
} as const;

export type StatusPagamento = (typeof STATUS_PAGAMENTO)[keyof typeof STATUS_PAGAMENTO];

export const STATUS_PARA_CANCELAMENTO: StatusPagamento[] = [
  STATUS_PAGAMENTO.CANCELADO,
  STATUS_PAGAMENTO.FALHOU,
];

export const STATUS_PAGAMENTO_ENUM = Object.values(STATUS_PAGAMENTO);
