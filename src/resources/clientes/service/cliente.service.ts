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

  async create(data: Partial<Cliente>) {
    const cliente = this.clienteRepository.create(data);
    const salvo = await this.clienteRepository.save(cliente);
    return {
      message: 'Cliente cadastrado com sucesso.',
      cliente: salvo,
    };
  }

  async findById(id: number) {
    return await this.clienteRepository.findOneBy({ id });
  }

  async findByCpf(cpf: string) {
    return await this.clienteRepository.findOneBy({ cpf });
  }
}
