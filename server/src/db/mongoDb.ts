import { Db, MongoClient } from 'mongodb';

export class MongoDb {
  private client: MongoClient;
  private readonly connectionString = 'mongodb://localhost:27017';
  private readonly dbName = 'whatdoumeme';

  public close(): void {
    if (this.client) {
      this.client
        .close()
        .then()
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error('close: client is undefined');
    }
  }

  public async connect(): Promise<void> {
    try {
      if (!this.client) {
        console.info(`[DB] Connectiong to ${this.connectionString}`);
        this.client = await MongoClient.connect(this.connectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('[DB] Connection established');
      }
    } catch (error) {
      console.log('[DB] Connection failed');
      console.error(error);
    }
  }

  public getDb(): Db {
    if (this.client) {
      return this.client.db(this.dbName);
    } else {
      console.error('[DB] no db found');

      return undefined;
    }
  }
}
