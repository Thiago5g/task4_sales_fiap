import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaController } from './controller/venda.controller';
import { VendaService } from './service/venda.service';
import { Venda } from './entity/venda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  controllers: [VendaController],
  providers: [VendaService],
})
export class VendaModule {}
