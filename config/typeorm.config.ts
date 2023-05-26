import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import './env';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  extra: {
    timezone: process.env.DB_TIMEZONE, // default setup
  },
};

export default typeOrmConfig;
