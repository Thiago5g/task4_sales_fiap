import { Venda } from './venda.entity';

describe('Venda Entity', () => {
  it('should be defined', () => {
    const venda = new Venda();
    expect(venda).toBeDefined();
  });

  it('should create venda with all properties', () => {
    const venda = new Venda();
    const currentDate = new Date();

    venda.id = 1;
    venda.clienteId = 10;
    venda.veiculoId = 5;
    venda.preco = 25000.5;
    venda.dataVenda = currentDate;

    expect(venda.id).toBe(1);
    expect(venda.clienteId).toBe(10);
    expect(venda.veiculoId).toBe(5);
    expect(venda.preco).toBe(25000.5);
    expect(venda.dataVenda).toBe(currentDate);
  });

  it('should have correct property types', () => {
    const venda = new Venda();
    venda.id = 1;
    venda.clienteId = 10;
    venda.veiculoId = 5;
    venda.preco = 25000.5;
    venda.dataVenda = new Date();

    expect(typeof venda.id).toBe('number');
    expect(typeof venda.clienteId).toBe('number');
    expect(typeof venda.veiculoId).toBe('number');
    expect(typeof venda.preco).toBe('number');
    expect(venda.dataVenda).toBeInstanceOf(Date);
  });

  it('should allow undefined values initially', () => {
    const venda = new Venda();

    expect(venda.id).toBeUndefined();
    expect(venda.clienteId).toBeUndefined();
    expect(venda.veiculoId).toBeUndefined();
    expect(venda.preco).toBeUndefined();
    expect(venda.dataVenda).toBeUndefined();
  });

  it('should work with decimal prices', () => {
    const venda = new Venda();
    venda.preco = 123.45;

    expect(venda.preco).toBe(123.45);
    expect(typeof venda.preco).toBe('number');
  });
});
