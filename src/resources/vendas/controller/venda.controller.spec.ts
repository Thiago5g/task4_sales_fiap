import { Test, TestingModule } from '@nestjs/testing';
import { VendaController } from './venda.controller';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { VendaService } from '../service/venda.service';

describe('VendaController', () => {
  let controller: VendaController;
  let service: VendaService;

  const mockVendaService = {
    realizarVenda: jest.fn(),
    listarVendas: jest.fn(),
    obterVendaPorVeiculoId: jest.fn(),
    atualizarPagamentoPorVeiculo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendaController],
      providers: [
        {
          provide: VendaService,
          useValue: mockVendaService,
        },
      ],
    }).compile();

    controller = module.get<VendaController>(VendaController);
    service = module.get<VendaService>(VendaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('vender', () => {
    it('should call realizarVenda with correct parameters (sem moeda explícita)', async () => {
      const createVendaDto: CreateVendaDto = {
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
      };
      const expectedResult = {
        message: 'Venda criada e aguardando pagamento.',
        venda: {
          id: 1,
          clienteId: 1,
          veiculoId: 2,
          preco: 25000.5,
          status: 'AGUARDANDO_PAGAMENTO',
          statusPagamento: 'PENDENTE',
        },
      };
      mockVendaService.realizarVenda.mockResolvedValue(expectedResult);
      const result = await controller.vender(createVendaDto);
      expect(service.realizarVenda).toHaveBeenCalledWith(
        1,
        2,
        25000.5,
        undefined,
      );
      expect(service.realizarVenda).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle service errors', async () => {
      const createVendaDto: CreateVendaDto = {
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
      };
      const error = new Error('Database error');
      mockVendaService.realizarVenda.mockRejectedValue(error);
      await expect(controller.vender(createVendaDto)).rejects.toThrow(
        'Database error',
      );
      expect(service.realizarVenda).toHaveBeenCalledWith(
        1,
        2,
        25000.5,
        undefined,
      );
    });

    it('should work with different valid data', async () => {
      const createVendaDto: CreateVendaDto = {
        clienteId: 10,
        veiculoId: 5,
        preco: 35000.0,
      };
      const expectedResult = {
        message: 'Venda criada e aguardando pagamento.',
        venda: {
          id: 2,
          clienteId: 10,
          veiculoId: 5,
          preco: 35000.0,
          status: 'AGUARDANDO_PAGAMENTO',
          statusPagamento: 'PENDENTE',
        },
      };
      mockVendaService.realizarVenda.mockResolvedValue(expectedResult);
      const result = await controller.vender(createVendaDto);
      expect(service.realizarVenda).toHaveBeenCalledWith(
        10,
        5,
        35000.0,
        undefined,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should forward moeda when provided', async () => {
      const createVendaDto: any = {
        clienteId: 7,
        veiculoId: 77,
        preco: 1234.56,
        moeda: 'USD',
      };
      const expectedResult = {
        message: 'Venda criada e aguardando pagamento.',
        venda: {
          id: 70,
          clienteId: 7,
          veiculoId: 77,
          preco: 1234.56,
          status: 'AGUARDANDO_PAGAMENTO',
          statusPagamento: 'PENDENTE',
        },
      };
      mockVendaService.realizarVenda.mockResolvedValue(expectedResult);
      await controller.vender(createVendaDto);
      expect(service.realizarVenda).toHaveBeenCalledWith(7, 77, 1234.56, 'USD');
    });
  });

  describe('listarVendas', () => {
    it('should return all vendas', async () => {
      const expectedVendas = [
        {
          id: 1,
          clienteId: 1,
          veiculoId: 2,
          preco: 25000.5,
          status: 'AGUARDANDO_PAGAMENTO',
          statusPagamento: 'PENDENTE',
        },
        {
          id: 2,
          clienteId: 2,
          veiculoId: 3,
          preco: 30000.0,
          status: 'AGUARDANDO_PAGAMENTO',
          statusPagamento: 'PENDENTE',
        },
      ];

      mockVendaService.listarVendas.mockResolvedValue(expectedVendas);

      const result = await controller.listarVendas();

      expect(service.listarVendas).toHaveBeenCalledWith();
      expect(service.listarVendas).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedVendas);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockVendaService.listarVendas.mockRejectedValue(error);

      await expect(controller.listarVendas()).rejects.toThrow('Database error');
      expect(service.listarVendas).toHaveBeenCalledWith();
    });
  });

  describe('obterVendaPorVeiculo', () => {
    it('should return venda when found', async () => {
      const veiculoId = 2;
      const expectedVenda = {
        id: 1,
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
        status: 'AGUARDANDO_PAGAMENTO',
        statusPagamento: 'PENDENTE',
      };

      mockVendaService.obterVendaPorVeiculoId.mockResolvedValue(expectedVenda);

      const result = await controller.obterVendaPorVeiculo(veiculoId);

      expect(service.obterVendaPorVeiculoId).toHaveBeenCalledWith(veiculoId);
      expect(service.obterVendaPorVeiculoId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedVenda);
    });

    it('should handle NotFoundException', async () => {
      const veiculoId = 999;
      const error = new Error('Venda não encontrada para este veículo.');
      mockVendaService.obterVendaPorVeiculoId.mockRejectedValue(error);

      await expect(controller.obterVendaPorVeiculo(veiculoId)).rejects.toThrow(
        'Venda não encontrada para este veículo.',
      );
      expect(service.obterVendaPorVeiculoId).toHaveBeenCalledWith(veiculoId);
    });

    it('should work with different veiculoId', async () => {
      const veiculoIdLocal = 5;
      const expectedVenda = {
        id: 3,
        clienteId: 3,
        veiculoId: veiculoIdLocal,
        preco: 45000.0,
        status: 'AGUARDANDO_PAGAMENTO',
        statusPagamento: 'PENDENTE',
      };
      mockVendaService.obterVendaPorVeiculoId.mockResolvedValue(expectedVenda);
      const result = await controller.obterVendaPorVeiculo(veiculoIdLocal);
      expect(result).toEqual(expectedVenda);
    });
  });

  describe('atualizarPagamento', () => {
    it('chama service.atualizarPagamentoPorVeiculo', async () => {
      const veiculoId = 77;
      const body = { statusPagamento: 'PAGO', preco: 199.9 } as any;
      const expected = {
        message: 'Pagamento atualizado com sucesso.',
        venda: { id: 5, veiculoId, status: 'VENDIDO', statusPagamento: 'PAGO' },
      };
      mockVendaService.atualizarPagamentoPorVeiculo.mockResolvedValue(expected);
      const resultPromise = (controller as any).atualizarPagamento(
        veiculoId,
        body,
      );
      await expect(resultPromise).resolves.toEqual(expected);
      expect(
        mockVendaService.atualizarPagamentoPorVeiculo,
      ).toHaveBeenCalledWith(veiculoId, {
        statusPagamento: 'PAGO',
        preco: 199.9,
      });
    });
  });
});
