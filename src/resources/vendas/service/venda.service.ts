import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../entity/venda.entity';
import { Cliente } from 'src/resources/clients/entity/cliente.entity';
import {
  VeiculoStatus,
  Veiculo,
} from 'src/resources/vehicles/entity/veiculo.entity';

@Injectable()
export class VendaService {
  constructor(
    @InjectRepository(Venda)
    private VendaRepo: Repository<Venda>,
    @InjectRepository(Cliente)
    private clienteRepo: Repository<Cliente>,
    @InjectRepository(Veiculo)
    private veiculoRepo: Repository<Veiculo>,
  ) {}

  async realizarVenda(cpf: string, veiculoId: number) {
    const cliente = await this.clienteRepo.findOneBy({ cpf });
    if (!cliente) throw new NotFoundException('cliente não encontrado');

    const veiculo = await this.veiculoRepo.findOneBy({ id: veiculoId });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    if (veiculo.status === VeiculoStatus.VENDIDO)
      throw new BadRequestException('Veículo já foi vendido');

    veiculo.status = VeiculoStatus.VENDIDO;
    await this.veiculoRepo.save(veiculo);

    const Venda = this.VendaRepo.create({ veiculo, cliente });
    return this.VendaRepo.save(Venda);
  }
}
