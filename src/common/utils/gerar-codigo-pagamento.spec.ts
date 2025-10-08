import {
  gerarCodigoPagamento,
  __resetarContadorPagamento,
} from './gerar-codigo-pagamento';

describe('gerarCodigoPagamento', () => {
  beforeEach(() => {
    __resetarContadorPagamento();
  });

  it('gera códigos incrementais com prefixo correto', () => {
    const c1 = gerarCodigoPagamento();
    const c2 = gerarCodigoPagamento();
    expect(c1).toMatch(/^PAG-1-[A-F0-9]{6}$/);
    expect(c2).toMatch(/^PAG-2-[A-F0-9]{6}$/);
  });

  it('mantém parte final hexadecimal de 6 chars', () => {
    const code = gerarCodigoPagamento();
    const parts = code.split('-');
    expect(parts[2]).toHaveLength(6);
  });
});
