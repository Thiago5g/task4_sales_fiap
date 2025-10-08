import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { VendaService } from './venda.service';
import { Venda } from '../entity/venda.entity';
import { STATUS_VENDA, STATUS_PAGAMENTO } from '../constants/status.constants';

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
    it('cria venda com status iniciais em PT-BR', async () => {
      const clienteId = 1;
      const veiculoId = 2;
      const preco = 25000.5;
      const mockVenda = {
        id: 1,
        clienteId,
        veiculoId,
        preco,
        moeda: 'BRL',
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        codigoPagamento: 'PAY-1-AAAAAA',
      } as any;
      mockRepository.create.mockReturnValue(mockVenda);
      mockRepository.save.mockResolvedValue(mockVenda);
      const result: any = await service.realizarVenda(
        clienteId,
        veiculoId,
        preco,
      );
      expect(repository.create).toHaveBeenCalledWith({
        veiculoId,
        clienteId,
        preco,
        moeda: 'BRL',
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        codigoPagamento: expect.any(String),
      });
      expect(result.message).toBe('Venda criada e aguardando pagamento.');
      expect(result.venda.status).toBe(STATUS_VENDA.AGUARDANDO_PAGAMENTO);
      expect(result.venda.statusPagamento).toBe(STATUS_PAGAMENTO.PENDENTE);
    });

    it('propaga erro do repository ao salvar', async () => {
      const clienteId = 1;
      const veiculoId = 2;
      const preco = 25000.5;
      const mockVenda = { clienteId, veiculoId, preco } as any;
      const error = new Error('Database connection failed');
      mockRepository.create.mockReturnValue(mockVenda);
      mockRepository.save.mockRejectedValue(error);
      await expect(
        service.realizarVenda(clienteId, veiculoId, preco),
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('listarVendas', () => {
    it('retorna lista de vendas', async () => {
      const mockVendas = [
        { id: 1, clienteId: 1, veiculoId: 2, preco: 25000.5 },
        { id: 2, clienteId: 2, veiculoId: 3, preco: 30000.0 },
      ];
      mockRepository.find.mockResolvedValue(mockVendas);
      const result = await service.listarVendas();
      expect(result).toEqual(mockVendas);
    });
    it('retorna array vazio', async () => {
      mockRepository.find.mockResolvedValue([]);
      const result = await service.listarVendas();
      expect(result).toEqual([]);
    });
    it('propaga erro', async () => {
      const error = new Error('Database error');
      mockRepository.find.mockRejectedValue(error);
      await expect(service.listarVendas()).rejects.toThrow('Database error');
    });
  });

  describe('obterVendaPorVeiculoId', () => {
    it('retorna a venda', async () => {
      const veiculoId = 2;
      const mockVenda = { id: 1, clienteId: 1, veiculoId, preco: 25000.5 };
      mockRepository.findOne.mockResolvedValue(mockVenda);
      const result = await service.obterVendaPorVeiculoId(veiculoId);
      expect(result).toEqual(mockVenda);
    });
    it('lança NotFoundException se não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.obterVendaPorVeiculoId(99)).rejects.toThrow(
        new NotFoundException('Venda não encontrada para este veículo.'),
      );
    });
  });

  describe('excluirVenda', () => {
    it('remove venda existente', async () => {
      const vendaId = 1;
      const mockVenda = { id: vendaId } as any;
      mockRepository.findOne.mockResolvedValue(mockVenda);
      mockRepository.remove.mockResolvedValue(mockVenda);
      const result = await service.excluirVenda(vendaId);
      expect(result).toEqual({ message: 'Venda excluída com sucesso.' });
    });
    it('erro se não existir', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.excluirVenda(999)).rejects.toThrow(
        new NotFoundException('Venda não encontrada.'),
      );
    });
  });

  describe('atualizarPagamentoPorVeiculo', () => {
    it('atualiza para PAGO e VENDIDO com timestamps', async () => {
      const veiculoId = 10;
      const venda = {
        id: 1,
        veiculoId,
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        preco: 100,
        pagoEm: null,
        vendidoEm: null,
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.PAGO },
      );
      expect(result.venda.status).toBe(STATUS_VENDA.VENDIDO);
      expect(result.venda.statusPagamento).toBe(STATUS_PAGAMENTO.PAGO);
      expect(result.venda.pagoEm).toBeDefined();
      expect(result.venda.vendidoEm).toBeDefined();
    });

    it('cancela quando statusPagamento = CANCELADO', async () => {
      const veiculoId = 11;
      const venda = {
        id: 2,
        veiculoId,
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        preco: 150,
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.CANCELADO },
      );
      expect(result.venda.status).toBe(STATUS_VENDA.CANCELADO);
    });

    it('mantém idempotência se repetir PAGO', async () => {
      const veiculoId = 12;
      const venda = {
        id: 3,
        veiculoId,
        status: STATUS_VENDA.VENDIDO,
        statusPagamento: STATUS_PAGAMENTO.PAGO,
        preco: 200,
        pagoEm: new Date(),
        vendidoEm: new Date(),
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.PAGO, preco: 210 },
      );
      expect(result.message).toMatch(/Nenhuma mudança/);
      expect(result.venda.preco).toBe(210);
    });

    it('atualiza para FALHOU e cancela venda', async () => {
      const veiculoId = 13;
      const venda = {
        id: 4,
        veiculoId,
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        preco: 500,
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.FALHOU },
      );
      expect(result.venda.status).toBe(STATUS_VENDA.CANCELADO);
      expect(result.venda.statusPagamento).toBe(STATUS_PAGAMENTO.FALHOU);
    });

    it('não permite transição de CANCELADO para PAGO', async () => {
      const veiculoId = 14;
      const venda = {
        id: 5,
        veiculoId,
        status: STATUS_VENDA.CANCELADO,
        statusPagamento: STATUS_PAGAMENTO.CANCELADO,
        preco: 800,
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: 'PAGO' },
      );
      expect(result.message).toMatch(/já cancelada/i);
      expect(result.venda.statusPagamento).toBe('CANCELADO');
    });

    it('apenas atualiza preço sem mudar status (idempotência de status)', async () => {
      const veiculoId = 15;
      const venda = {
        id: 6,
        veiculoId,
        status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
        statusPagamento: STATUS_PAGAMENTO.PENDENTE,
        preco: 1000,
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.PENDENTE, preco: 1200 },
      );
      expect(result.venda.preco).toBe(1200);
      expect(result.message).toMatch(/Nenhuma mudança/);
    });
    it('mantém status principal VENDIDO mesmo se statusPagamento tenta voltar para PENDENTE', async () => {
      const veiculoId = 16;
      const venda = {
        id: 7,
        veiculoId,
        status: STATUS_VENDA.VENDIDO,
        statusPagamento: STATUS_PAGAMENTO.PAGO,
        preco: 2000,
        pagoEm: new Date(),
        vendidoEm: new Date(),
      } as any;
      mockRepository.findOne.mockResolvedValue(venda);
      mockRepository.save.mockImplementation(async (v) => v);
      const result = await (service as any).atualizarPagamentoPorVeiculo(
        veiculoId,
        { statusPagamento: STATUS_PAGAMENTO.PENDENTE },
      );
      expect(result.venda.status).toBe(STATUS_VENDA.VENDIDO);
      // statusPagamento voltou para PENDENTE (implementação atual permite), mas status principal não regrediu
      expect(result.venda.statusPagamento).toBe(STATUS_PAGAMENTO.PENDENTE);
    });
  });
});
