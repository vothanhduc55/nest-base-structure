import { Injectable } from '@nestjs/common';
require('dotenv').config()

@Injectable()
export class ConfigurationService {
    private environmentHosting: string = process.env.NODE_ENV || 'development';

    get(name: string): string {
        console.log('process.env[name]: ', process.env.PORT)
        console.log('process.env[name]: ', process.env.HOST)
        console.log('process.env[name]: ', process.env.MONGO_URI)
        console.log('process.env[name]: ', process.env.PORT)

        return process.env[name];
    }

    get isDevelopment(): boolean {
        return this.environmentHosting === 'development';
    }
}
