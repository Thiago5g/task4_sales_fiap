import { Venda } from './venda.entity';

describe('Venda Entity', () => {
  it('should be defined', () => {
    const venda = new Venda();
    expect(venda).toBeDefined();
  });

  it('atribui propriedades principais', () => {
    const venda = new Venda();
    venda.id = 1;
    venda.clienteId = 10;
    venda.veiculoId = 5;
    venda.preco = 25000.5;
    venda.moeda = 'BRL';
    venda.status = 'AGUARDANDO_PAGAMENTO' as any;
    venda.statusPagamento = 'PENDENTE' as any;
    expect(venda.id).toBe(1);
    expect(venda.moeda).toBe('BRL');
    expect(venda.status).toBe('AGUARDANDO_PAGAMENTO');
    expect(venda.statusPagamento).toBe('PENDENTE');
  });

  it('tipos das propriedades principais', () => {
    const venda = new Venda();
    venda.id = 1;
    venda.clienteId = 10;
    venda.veiculoId = 5;
    venda.preco = 25000.5;
    expect(typeof venda.id).toBe('number');
    expect(typeof venda.clienteId).toBe('number');
    expect(typeof venda.veiculoId).toBe('number');
    expect(typeof venda.preco).toBe('number');
  });

  it('permite valores undefined inicialmente', () => {
    const venda = new Venda();
    expect(venda.id).toBeUndefined();
    expect(venda.clienteId).toBeUndefined();
    expect(venda.veiculoId).toBeUndefined();
    expect(venda.preco).toBeUndefined();
  });

  it('aceita preço decimal', () => {
    const venda = new Venda();
    venda.preco = 123.45;
    expect(venda.preco).toBe(123.45);
  });
});
