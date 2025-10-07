import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../entity/venda.entity';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Venda)
    private VendaRepo: Repository<Venda>,
  ) {}

  async realizarVenda(clienteId: number, veiculoId: number, preco: number) {
    console.log(clienteId, 'clienteId');
    const venda = this.VendaRepo.create({ veiculoId, clienteId, preco } as any);
    const vendaSalva = await this.VendaRepo.save(venda);

    return {
      message: 'Venda efetuada com sucesso.',
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
}
