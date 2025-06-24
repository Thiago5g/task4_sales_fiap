import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClienteService } from '../service/cliente.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clientervice: ClienteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiBody({ type: CreateClienteDto })
  create(@Body() body: CreateClienteDto) {
    return this.clientervice.create(body);
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Buscar cliente por CPF' })
  @ApiParam({ name: 'cpf', example: '12345678900' })
  findByCpf(@Param('cpf') cpf: string) {
    return this.clientervice.findByCpf(cpf);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiParam({ name: 'id', example: 1 })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.clientervice.findById(id);
  }
}
