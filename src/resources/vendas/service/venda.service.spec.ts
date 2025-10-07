import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { VendaService } from './venda.service';
import { Venda } from '../entity/venda.entity';

describe('VendaService', () => {
  let service: VendaService;
  let repository: Repository<Venda>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VendaService,
        {
          provide: getRepositoryToken(Venda),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VendaService>(VendaService);
    repository = module.get<Repository<Venda>>(getRepositoryToken(Venda));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('realizarVenda', () => {
    it('should create and save a venda successfully', async () => {
      const clienteId = 1;
      const veiculoId = 2;
      const preco = 25000.5;

      const mockVenda = {
        id: 1,
        clienteId,
        veiculoId,
        preco,
        dataVenda: new Date(),
      };

      mockRepository.create.mockReturnValue(mockVenda);
      mockRepository.save.mockResolvedValue(mockVenda);

      const result = await service.realizarVenda(clienteId, veiculoId, preco);

      expect(repository.create).toHaveBeenCalledWith({
        veiculoId,
        clienteId,
        preco,
      });
      expect(repository.save).toHaveBeenCalledWith(mockVenda);
      expect(result).toEqual({
        message: 'Venda efetuada com sucesso.',
        venda: mockVenda,
      });
    });

    it('should handle repository errors', async () => {
      const clienteId = 1;
      const veiculoId = 2;
      const preco = 25000.5;

      const mockVenda = { clienteId, veiculoId, preco };
      const error = new Error('Database connection failed');

      mockRepository.create.mockReturnValue(mockVenda);
      mockRepository.save.mockRejectedValue(error);

      await expect(
        service.realizarVenda(clienteId, veiculoId, preco),
      ).rejects.toThrow('Database connection failed');
      expect(repository.create).toHaveBeenCalledWith({
        veiculoId,
        clienteId,
        preco,
      });
      expect(repository.save).toHaveBeenCalledWith(mockVenda);
    });
  });

  describe('listarVendas', () => {
    it('should return all vendas', async () => {
      const mockVendas = [
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

      mockRepository.find.mockResolvedValue(mockVendas);

      const result = await service.listarVendas();

      expect(repository.find).toHaveBeenCalledWith();
      expect(result).toEqual(mockVendas);
    });

    it('should return empty array when no vendas exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.listarVendas();

      expect(repository.find).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);

      await expect(service.listarVendas()).rejects.toThrow('Database error');
      expect(repository.find).toHaveBeenCalledWith();
    });
  });

  describe('obterVendaPorVeiculoId', () => {
    it('should return venda when found', async () => {
      const veiculoId = 2;
      const mockVenda = {
        id: 1,
        clienteId: 1,
        veiculoId: veiculoId,
        preco: 25000.5,
        dataVenda: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockVenda);

      const result = await service.obterVendaPorVeiculoId(veiculoId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { veiculoId: veiculoId },
      });
      expect(result).toEqual(mockVenda);
    });

    it('should throw NotFoundException when venda not found', async () => {
      const veiculoId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.obterVendaPorVeiculoId(veiculoId)).rejects.toThrow(
        new NotFoundException('Venda não encontrada para este veículo.'),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { veiculoId: veiculoId },
      });
    });

    it('should handle repository errors', async () => {
      const veiculoId = 1;
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.obterVendaPorVeiculoId(veiculoId)).rejects.toThrow(
        'Database error',
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { veiculoId: veiculoId },
      });
    });
  });

  describe('excluirVenda', () => {
    it('should delete venda successfully when found', async () => {
      const vendaId = 1;
      const mockVenda = {
        id: vendaId,
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
        dataVenda: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockVenda);
      mockRepository.remove.mockResolvedValue(mockVenda);

      const result = await service.excluirVenda(vendaId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: vendaId },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockVenda);
      expect(result).toEqual({ message: 'Venda excluída com sucesso.' });
    });

    it('should throw NotFoundException when venda not found', async () => {
      const vendaId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.excluirVenda(vendaId)).rejects.toThrow(
        new NotFoundException('Venda não encontrada.'),
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: vendaId },
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should handle repository errors on find', async () => {
      const vendaId = 1;
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.excluirVenda(vendaId)).rejects.toThrow(
        'Database error',
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: vendaId },
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });

    it('should handle repository errors on remove', async () => {
      const vendaId = 1;
      const mockVenda = {
        id: vendaId,
        clienteId: 1,
        veiculoId: 2,
        preco: 25000.5,
        dataVenda: new Date(),
      };
      const error = new Error('Delete failed');

      mockRepository.findOne.mockResolvedValue(mockVenda);
      mockRepository.remove.mockRejectedValue(error);

      await expect(service.excluirVenda(vendaId)).rejects.toThrow(
        'Delete failed',
      );
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: vendaId },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockVenda);
    });
  });
});
