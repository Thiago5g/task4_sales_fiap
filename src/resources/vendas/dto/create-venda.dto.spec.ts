import { validate } from 'class-validator';
import { CreateVendaDto } from './create-venda.dto';

describe('CreateVendaDto', () => {
  it('should be defined', () => {
    const dto = new CreateVendaDto();
    expect(dto).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    const dto = new CreateVendaDto();
    dto.clienteId = 1;
    dto.veiculoId = 2;
    dto.preco = 25000.5;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid clienteId', async () => {
    const dto = new CreateVendaDto();
    dto.clienteId = 'invalid' as any;
    dto.veiculoId = 2;
    dto.preco = 25000.5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('clienteId');
  });

  it('should fail validation with invalid veiculoId', async () => {
    const dto = new CreateVendaDto();
    dto.clienteId = 1;
    dto.veiculoId = 'invalid' as any;
    dto.preco = 25000.5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('veiculoId');
  });

  it('should fail validation with invalid preco', async () => {
    const dto = new CreateVendaDto();
    dto.clienteId = 1;
    dto.veiculoId = 2;
    dto.preco = 'invalid' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('preco');
  });

  it('should have correct property types', () => {
    const dto = new CreateVendaDto();
    dto.clienteId = 1;
    dto.veiculoId = 2;
    dto.preco = 25000.5;

    expect(typeof dto.clienteId).toBe('number');
    expect(typeof dto.veiculoId).toBe('number');
    expect(typeof dto.preco).toBe('number');
  });
});
