import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Venda } from './resources/vendas/entity/venda.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres.ywupywmiuoqwzoupjzew:Egs61512416@aws-0-us-east-2.pooler.supabase.com:5432/postgres',
  entities: [Venda],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

export default AppDataSource;
