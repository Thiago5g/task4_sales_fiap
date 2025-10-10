import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { VendaModule } from './resources/vendas/venda.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:10203040@db.dlilvhrablvzweomvhvj.supabase.co:5432/postgres',
      autoLoadEntities: true,
      // synchronize: true,
    }),
    VendaModule,
  ],
  providers: [],
})
export class AppModule {}
