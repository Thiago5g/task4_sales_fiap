import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { VendaService } from '../service/venda.service';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar uma venda' })
  @ApiBody({ type: CreateVendaDto })
  vender(@Body() body: CreateVendaDto) {
    console.log(body, 'body');
    const { clienteId, veiculoId, preco } = body;
    return this.vendaService.realizarVenda(clienteId, veiculoId, preco);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas' })
  listarVendas() {
    return this.vendaService.listarVendas();
  }

  @Get('veiculo/:veiculoId')
  @ApiOperation({ summary: 'Obter venda por ID do veículo' })
  @ApiParam({ name: 'veiculoId', type: 'number', description: 'ID do veículo' })
  obterVendaPorVeiculo(@Param('veiculoId', ParseIntPipe) veiculoId: number) {
    return this.vendaService.obterVendaPorVeiculoId(veiculoId);
  }
}
