import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../entity/venda.entity';
import { gerarCodigoPagamento } from '../../../common/utils/gerar-codigo-pagamento';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import {
  STATUS_PAGAMENTO,
  STATUS_VENDA,
  STATUS_PARA_CANCELAMENTO,
} from '../constants/status.constants';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Venda)
    private VendaRepo: Repository<Venda>,
  ) {}

  async realizarVenda(
    clienteId: number,
    veiculoId: number,
    preco: number,
    moeda = 'BRL',
  ) {
    const codigoPagamento = gerarCodigoPagamento();
    const venda = this.VendaRepo.create({
      veiculoId,
      clienteId,
      preco,
      moeda,
      status: STATUS_VENDA.AGUARDANDO_PAGAMENTO,
      statusPagamento: STATUS_PAGAMENTO.PENDENTE,
      codigoPagamento,
    } as any);
    const vendaSalva = await this.VendaRepo.save(venda);
    return {
      message: 'Venda criada e aguardando pagamento.',
      venda: vendaSalva,
    };
  }
  async listarVendas() {
    const vendas = await this.VendaRepo.find();
    return vendas;
  }

  async obterVendaPorVeiculoId(veiculoId: number) {
    const venda = await this.VendaRepo.findOne({ where: { veiculoId } });
    if (!venda) {
      throw new NotFoundException('Venda não encontrada para este veículo.');
    }
    return venda;
  }

  async excluirVenda(id: number) {
    const venda = await this.VendaRepo.findOne({ where: { id } });
    if (!venda) {
      throw new NotFoundException('Venda não encontrada.');
    }
    await this.VendaRepo.remove(venda);
    return { message: 'Venda excluída com sucesso.' };
  }

  /**
   * Atualiza statusPagamento (e status geral) e opcionalmente o preço da venda identificado pelo veiculoId.
   * Regras:
   * - PAID => statusPagamento = PAID, status = SOLD, define pagoEm & vendidoEm se ainda não definidos
   * - CANCELED/FAILED => statusPagamento correspondente, status = CANCELED (se ainda não SOLD)
   * - PENDING => apenas volta para pendente se ainda não concluído/cancelado
   * - Não permite mudar após CANCELED para outro estado diferente de CANCELED.
   * Idempotente: se já estiver no mesmo statusPagamento não altera timestamps existentes.
   */
  async atualizarPagamentoPorVeiculo(
    veiculoId: number,
    dto: Omit<UpdatePagamentoDto, 'veiculoId'>,
  ) {
    const venda = await this.VendaRepo.findOne({ where: { veiculoId } });
    if (!venda) {
      throw new NotFoundException('Venda não encontrada para este veículo.');
    }

    // Tentativa de transição após cancelamento definitivo
    if (
      venda.status === STATUS_VENDA.CANCELADO &&
      dto.statusPagamento &&
      dto.statusPagamento !== STATUS_PAGAMENTO.CANCELADO
    ) {
      return {
        message: 'Venda já cancelada. Transição não permitida.',
        venda,
      };
    }

    const originalStatusPagamento = venda.statusPagamento;

    this.aplicarAtualizacoesDePreco(venda, dto.preco);
    if (this.deveAplicarTransicao(venda, dto.statusPagamento)) {
      this.aplicarTransicaoStatus(venda, dto.statusPagamento as any);
    }

    const vendaAtualizada = await this.VendaRepo.save(venda);
    const mudouStatus =
      originalStatusPagamento !== vendaAtualizada.statusPagamento;
    return {
      message: mudouStatus
        ? 'Pagamento atualizado com sucesso.'
        : 'Nenhuma mudança de status. Dados atualizados.',
      venda: vendaAtualizada,
    };
  }

  private aplicarAtualizacoesDePreco(venda: Venda, preco?: number) {
    if (typeof preco === 'number' && preco >= 0) {
      venda.preco = preco;
    }
  }

  private deveAplicarTransicao(
    venda: Venda,
    novoStatusPagamento?: string,
  ): boolean {
    return (
      !!novoStatusPagamento && novoStatusPagamento !== venda.statusPagamento
    );
  }

  private aplicarTransicaoStatus(venda: Venda, novo: string) {
    const agora = new Date();
    venda.statusPagamento = novo as any;

    if (novo === STATUS_PAGAMENTO.PAGO) {
      venda.status = STATUS_VENDA.VENDIDO;
      if (!venda.pagoEm) venda.pagoEm = agora;
      if (!venda.vendidoEm) venda.vendidoEm = agora;
      return;
    }

    if (STATUS_PARA_CANCELAMENTO.includes(novo as any)) {
      venda.status = STATUS_VENDA.CANCELADO;
      return;
    }

    if (
      novo === STATUS_PAGAMENTO.PENDENTE &&
      venda.status !== STATUS_VENDA.VENDIDO
    ) {
      venda.status = STATUS_VENDA.AGUARDANDO_PAGAMENTO;
    }
  }
}
