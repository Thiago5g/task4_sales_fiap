import { Controller, Post, Body } from '@nestjs/common';
import { VendaService } from '../service/venda.service';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar uma venda' })
  @ApiBody({ type: CreateVendaDto })
  vender(@Body() body: CreateVendaDto) {
    const { cpf, veiculoId } = body;
    return this.vendaService.realizarVenda(cpf, veiculoId);
  }
}
