import { Controller, Get, Body, Param, Patch, Post } from '@nestjs/common';
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
  obterVendaPorVeiculo(@Param('veiculoId') veiculoId: string) {
    return this.vendaService.obterVendaPorVeiculoId(Number(veiculoId));
  }

  @Patch('pagamento/:codigoPagamento')
  @ApiOperation({
    summary:
      'Atualizar status de pagamento e preço da venda por código de pagamento',
  })
  @ApiParam({
    name: 'codigoPagamento',
    type: 'string',
    description: 'Código do pagamento',
  })
  @ApiBody({ type: UpdatePagamentoDto })
  atualizarPagamento(
    @Param('codigoPagamento') codigoPagamento: string,
    @Body() body: UpdatePagamentoDto,
  ) {
    const { statusPagamento, preco } = body;
    return this.vendaService.atualizarPagamentoPorCodigo(codigoPagamento, {
      statusPagamento,
      preco,
    });
  }
}
