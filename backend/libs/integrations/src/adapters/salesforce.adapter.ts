import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ExternalCustomer } from '../interfaces/external-customer.interface';
import { ExternalOrder } from '../interfaces/external-order.interface';
import { ExternalProduct } from '../interfaces/external-product.interface';
import * as jsforce from 'jsforce';
import { ConfigService } from '@nestjs/config';
import { ExternalContact } from '../interfaces/external-contact.interface';

@Injectable()
export class SalesforceAdapter implements OnModuleInit {
  private logger: Logger = new Logger(SalesforceAdapter.name);
  private conn: jsforce.Connection;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // await this.initializeConnection();
  }

  private async initializeConnection() {
    const oauth2 = new jsforce.OAuth2({
      clientId: this.configService.get('SALESFORCE_CLIENT_ID'),
      clientSecret: this.configService.get('SALESFORCE_CLIENT_SECRET'),
      loginUrl: this.configService.get('SALESFORCE_LOGIN_URL'),
    });

    this.conn = new jsforce.Connection({ oauth2 });

    await this.login();
  }

  async login() {
    try {
      const username = this.configService.get('SALESFORCE_USERNAME');
      const password = this.configService.get('SALESFORCE_PASSWORD');
      const clientSecret = this.configService.get('SALESFORCE_CLIENT_SECRET');
      await this.conn.login(username, password + clientSecret);
    } catch (err) {
      this.logger.error(`Failed to connect to Salesforce`, err.message);
    }
  }

  async query(soql: string) {
    try {
      return await this.conn.query(soql);
    } catch (error) {
      this.logger.error(`Failed to execute SOQL query: ${soql}`, error.stack);
      throw error;
    }
  }

  private async create(objectName: string, data: any) {
    return this.conn.sobject(objectName).create(data);
  }

  private async update(objectName: string, id: string, data: any) {
    return this.conn.sobject(objectName).update({ Id: id, ...data });
  }

  private async delete(objectName: string, id: string) {
    return this.conn.sobject(objectName).destroy(id);
  }

  async findClients() {
    const data: ExternalCustomer[] = [];
    return { data: data, limit: 50, offset: 0, total: 0 };
  }

  async findSales(): Promise<ExternalOrder[]> {
    throw new Error('not implemented');
  }

  async findProducts(): Promise<ExternalProduct[]> {
    throw new Error('not implemented');
  }

  async findContacts(): Promise<ExternalContact[]> {
    const soql = 'SELECT Id, FirstName, LastName, Email FROM Contact';
    const result = await this.query(soql);
    return result.records.map((record: any) => record);
  }

  async findContactById(id: string): Promise<ExternalContact> {
    const soql = `SELECT Id, FirstName, LastName, Email FROM Contact WHERE Id = '${id}'`;
    const result = await this.query(soql);
    return result.records[0] as ExternalContact;
  }
}
