import {
  Controller,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { VendaService } from '../service/venda.service';
import { CreateVendaDto } from '../dto/create-venda.dto';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';

@ApiTags('Vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  @ApiOperation({ summary: 'Realizar uma venda' })
  @ApiBody({ type: CreateVendaDto })
  vender(@Body() body: CreateVendaDto) {
    const { clienteId, veiculoId, preco, moeda } = body as any;
    return this.vendaService.realizarVenda(clienteId, veiculoId, preco, moeda);
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

  @Patch('veiculo/:veiculoId/pagamento')
  @ApiOperation({ summary: 'Atualizar status de pagamento e preço da venda' })
  @ApiParam({ name: 'veiculoId', type: 'number', description: 'ID do veículo' })
  @ApiBody({ type: UpdatePagamentoDto })
  atualizarPagamento(
    @Param('veiculoId', ParseIntPipe) veiculoId: number,
    @Body() body: Omit<UpdatePagamentoDto, 'veiculoId'>,
  ) {
    const { statusPagamento, preco } = body;
    return this.vendaService.atualizarPagamentoPorVeiculo(veiculoId, {
      statusPagamento,
      preco,
    });
  }
}
