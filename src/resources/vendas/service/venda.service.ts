import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../entity/venda.entity';
import { gerarCodigoPagamento } from '../../../common/utils/gerar-codigo-pagamento';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';

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
      status: 'AGUARDANDO_PAGAMENTO',
      statusPagamento: 'PENDENTE',
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

    // Bloqueia transições após CANCELED (exceto permanecer CANCELED)
    if (
      venda.status === 'CANCELADO' &&
      dto.statusPagamento &&
      dto.statusPagamento !== 'CANCELADO'
    ) {
      return {
        message: 'Venda já cancelada. Transição não permitida.',
        venda,
      };
    }

    const agora = new Date();
    const originalStatusPagamento = venda.statusPagamento;

    // Atualiza preco se enviado
    if (typeof dto.preco === 'number' && dto.preco >= 0) {
      venda.preco = dto.preco;
    }

    if (dto.statusPagamento && dto.statusPagamento !== venda.statusPagamento) {
      venda.statusPagamento = dto.statusPagamento as any;

      if (dto.statusPagamento === 'PAGO') {
        venda.status = 'VENDIDO';
        if (!venda.pagoEm) venda.pagoEm = agora;
        if (!venda.vendidoEm) venda.vendidoEm = agora;
      } else if (
        dto.statusPagamento === 'CANCELADO' ||
        dto.statusPagamento === 'FALHOU'
      ) {
        venda.status = 'CANCELADO';
      } else if (dto.statusPagamento === 'PENDENTE') {
        // Só volta para pendente se ainda não VENDIDO
        if (venda.status !== 'VENDIDO') {
          venda.status = 'AGUARDANDO_PAGAMENTO';
        }
      }
    }

    // Idempotência: se statusPagamento igual, apenas aplica eventual preco
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
}
