import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entity/cliente.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  create(data: Partial<Cliente>) {
    const cliente = this.clienteRepository.create(data);
    return this.clienteRepository.save(cliente);
  }

  findById(id: number) {
    return this.clienteRepository.findOneBy({ id });
  }

  findByCpf(cpf: string) {
    return this.clienteRepository.findOneBy({ cpf });
  }
}
