import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

export interface WeaviateConfig {
  scheme: 'http' | 'https';
  host: string;
  apiKey?: string;
}

export interface WeaviateObject {
  id: string;
  class: string;
  properties: Record<string, any>;
  vector?: number[];
  creationTimeUnix?: number;
  lastUpdateTimeUnix?: number;
}

export class WeaviateService {
  private client: WeaviateClient | null = null;
  private isConnected: boolean = false;

  async connect(config: WeaviateConfig): Promise<boolean> {
    try {
      let clientConfig: any = {
        scheme: config.scheme,
        host: config.host,
      };

      if (config.apiKey) {
        clientConfig = {
          ...clientConfig,
          apiKey: new ApiKey(config.apiKey),
        };
      }

      this.client = weaviate.client(clientConfig);
      
      // Test connection
      await this.client.misc.liveChecker().do();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('Failed to connect to Weaviate:', error);
      this.isConnected = false;
      return false;
    }
  }

  async getCollections(): Promise<string[]> {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const schema = await this.client.schema.getter().do();
      return schema.classes?.map((cls: any) => cls.class) || [];
    } catch (error) {
      console.error('Failed to get collections:', error);
      throw error;
    }
  }

  async getObjectsFromCollection(collectionName: string, limit: number = 100): Promise<WeaviateObject[]> {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const response = await this.client.data
        .getter()
        .withClassName(collectionName)
        .withLimit(limit)
        .do();

      return response.objects?.map((obj: any) => ({
        id: obj.id,
        class: obj.class,
        properties: obj.properties || {},
        vector: obj.vector,
        creationTimeUnix: obj.creationTimeUnix,
        lastUpdateTimeUnix: obj.lastUpdateTimeUnix,
      })) || [];
    } catch (error) {
      console.error('Failed to get objects from collection:', error);
      throw error;
    }
  }

  async getCollectionSchema(collectionName: string): Promise<any> {
    if (!this.client || !this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const schema = await this.client.schema.classGetter().withClassName(collectionName).do();
      return schema;
    } catch (error) {
      console.error('Failed to get collection schema:', error);
      throw error;
    }
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    this.client = null;
    this.isConnected = false;
  }
}

export const weaviateService = new WeaviateService();