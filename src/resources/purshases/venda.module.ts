import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaController } from './controller/venda.controller';
import { VendaService } from './service/venda.service';
import { Venda } from './entity/venda.entity';
import { Cliente } from '../clients/entity/cliente.entity';
import { Veiculo } from '../vehicles/entity/veiculo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda, Cliente, Veiculo])],
  controllers: [VendaController],
  providers: [VendaService],
})
export class VendaModule {}
