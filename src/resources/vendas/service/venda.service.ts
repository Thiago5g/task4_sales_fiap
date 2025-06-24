import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from '../entity/venda.entity';
import { Cliente } from 'src/resources/clientes/entity/cliente.entity';
import {
  VeiculoStatus,
  Veiculo,
} from 'src/resources/veiculos/entity/veiculo.entity';

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
    if (!cliente) throw new NotFoundException('Cliente não encontrado');
  
    const veiculo = await this.veiculoRepo.findOneBy({ id: veiculoId });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado');
    if (veiculo.status === VeiculoStatus.VENDIDO)
      throw new BadRequestException('Veículo já foi vendido');
  
    veiculo.status = VeiculoStatus.VENDIDO;
    await this.veiculoRepo.save(veiculo);
  
    const venda = this.VendaRepo.create({ veiculo, cliente });
    const vendaSalva = await this.VendaRepo.save(venda);
  
    return {
      message: 'Venda efetuada com sucesso.',
      venda: vendaSalva,
    };
  }
}
