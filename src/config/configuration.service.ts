// Import the TypeOrmModuleOptions from the NestJS TypeORM module
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// Load environment variables from a .env file
require('dotenv').config();

// Configuration service class
class ConfigService {
  // Constructor takes an object representing environment variables
  constructor(private env: { [k: string]: string | undefined }) {}

  // Private method to retrieve a value from the environment variables
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  // Method to ensure that specific keys are present in the environment variables
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  // Method to get the PORT value from the environment variables
  public getPort() {
    return this.getValue('PORT', true);
  }

  // Method to check if the application is in production mode
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode !== 'DEV';
  }

  // Method to get the TypeORM configuration options
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      // Retrieve host, port, username, password, and database from environment variables
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),

      // Specify the location of entity files
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      // Specify the migrations table name
      migrationsTableName: 'migration',

      // Specify the location of migration files
      migrations: [__dirname + 'src/migration/*.ts'],
      autoLoadEntities: true,
      synchronize: true,

      // Enable SSL in production environment
      ssl: this.isProduction(),
    };
  }
}

// Create an instance of ConfigService using environment variables and ensure required keys are present
const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

// Export the instance of ConfigService
export { configService };
