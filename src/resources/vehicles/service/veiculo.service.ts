import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veiculo, VeiculoStatus } from '../entity/veiculo.entity';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,
  ) {}

  async criarveiculo(data: Partial<Veiculo>) {
    const veiculo = this.veiculoRepo.create({
      ...data,
      status: VeiculoStatus.DISPONIVEL,
    });
    return this.veiculoRepo.save(veiculo);
  }

  async editarveiculo(id: number, data: Partial<Veiculo>) {
    const veiculo = await this.veiculoRepo.findOneBy({ id });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    Object.assign(veiculo, data);
    return this.veiculoRepo.save(veiculo);
  }

  listarDisponiveis() {
    return this.veiculoRepo.find({
      where: { status: VeiculoStatus.DISPONIVEL },
      order: { preco: 'ASC' },
    });
  }

  listarVendidos() {
    return this.veiculoRepo.find({
      where: { status: VeiculoStatus.VENDIDO },
      order: { preco: 'ASC' },
    });
  }

  listarTodos() {
    return this.veiculoRepo.find({
      order: { preco: 'ASC' },
    });
  }
}
