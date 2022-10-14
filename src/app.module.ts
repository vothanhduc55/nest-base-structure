import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './modules/todo/todo.module';
import { Configuration } from './shared/Configuration/configuration.enum';
import { ConfigurationService } from './shared/Configuration/configuration.service';
import { ShareModule } from './shared/share.module';

@Module({
  imports: [TodoModule, ShareModule],
  controllers: [AppController],
  providers: [AppService, ConfigurationService],
})
export class AppModule {
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(_configurationService: ConfigurationService) {
      AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
      AppModule.host = _configurationService.get(Configuration.HOST);
      AppModule.isDev = _configurationService.isDevelopment;
  }

  private static normalizePort(param: number | string): number | string {
      const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;
      if (isNaN(portNumber)) return param;
      else if (portNumber >= 0) return portNumber;
  }
}
