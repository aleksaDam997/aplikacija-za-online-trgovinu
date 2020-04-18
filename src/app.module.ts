import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'entities/Administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';

DatabaseConfiguration

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfiguration.hostname,
      port: DatabaseConfiguration.port,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Administrator]
    }),
    TypeOrmModule.forFeature([Administrator])
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
