import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './resources/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './resources/auth/jwt-passport/jwt-strategy';
import { JwtAuthGuard } from './resources/auth/jwt-passport/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { ClienteModule } from './resources/clients/cliente.module';
import { VeiculoModule } from './resources/vehicles/veiculo.module';
import { VendaModule } from './resources/purshases/venda.module';
import { UserModule } from './resources/users/user.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres.ywupywmiuoqwzoupjzew:Egs61512416@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
      autoLoadEntities: true,
      // synchronize: true,
    }),
    AuthModule,
    ClienteModule,
    VeiculoModule,
    VendaModule,
    UserModule
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
