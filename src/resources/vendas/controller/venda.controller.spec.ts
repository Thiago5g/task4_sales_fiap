import { Test, TestingModule } from '@nestjs/testing';
import { VendaController } from './venda.controller';
import { VendaService } from '../service/venda.service';
import { CreateVendaDto } from '../dto/create-venda.dto';

describe('VendaController', () => {
  let controller: VendaController;
  let service: VendaService;

  const mockVendaService = {
    realizarVenda: jest.fn(),
    listarVendas: jest.fn(),
    obterVendaPorVeiculoId: jest.fn(),
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
    it('should call realizarVenda with correct parameters', async () => {
      const createVendaDto: CreateVendaDto = {
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
      };

      const expectedResult = {
        message: 'Venda efetuada com sucesso.',
        venda: {
          id: 1,
          clienteId: 1,
          veiculoId: 2,
          preco: 25000.5,
          dataVenda: new Date(),
        },
      };

      mockVendaService.realizarVenda.mockResolvedValue(expectedResult);

      const result = await controller.vender(createVendaDto);

      expect(service.realizarVenda).toHaveBeenCalledWith(1, 2, 25000.5);
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
      expect(service.realizarVenda).toHaveBeenCalledWith(1, 2, 25000.5);
    });

    it('should work with different valid data', async () => {
      const createVendaDto: CreateVendaDto = {
        clienteId: 10,
        veiculoId: 5,
        preco: 35000.0,
      };

      const expectedResult = {
        message: 'Venda efetuada com sucesso.',
        venda: {
          id: 2,
          clienteId: 10,
          veiculoId: 5,
          preco: 35000.0,
          dataVenda: new Date(),
        },
      };

      mockVendaService.realizarVenda.mockResolvedValue(expectedResult);

      const result = await controller.vender(createVendaDto);

      expect(service.realizarVenda).toHaveBeenCalledWith(10, 5, 35000.0);
      expect(result).toEqual(expectedResult);
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
          dataVenda: new Date(),
        },
        {
          id: 2,
          clienteId: 2,
          veiculoId: 3,
          preco: 30000.0,
          dataVenda: new Date(),
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
        dataVenda: new Date(),
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
      const veiculoId = 5;
      const expectedVenda = {
        id: 3,
        clienteId: 3,
        veiculoId: 5,
        preco: 45000.0,
        dataVenda: new Date(),
      };

      mockVendaService.obterVendaPorVeiculoId.mockResolvedValue(expectedVenda);

      const result = await controller.obterVendaPorVeiculo(veiculoId);

      expect(service.obterVendaPorVeiculoId).toHaveBeenCalledWith(veiculoId);
      expect(result).toEqual(expectedVenda);
    });
  });
});
