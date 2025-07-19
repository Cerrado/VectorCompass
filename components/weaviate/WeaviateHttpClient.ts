// HTTP-based Weaviate client for better React Native compatibility
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

export class WeaviateHttpService {
  private baseUrl: string = '';
  private headers: Record<string, string> = {};
  private isConnected: boolean = false;

  async connect(config: WeaviateConfig): Promise<boolean> {
    try {
      this.baseUrl = `${config.scheme}://${config.host}/v1`;
      this.headers = {
        'Content-Type': 'application/json',
      };

      if (config.apiKey) {
        this.headers['Authorization'] = `Bearer ${config.apiKey}`;
      }

      // Test connection by getting meta info
      const response = await fetch(`${this.baseUrl}/meta`, {
        method: 'GET',
        headers: this.headers,
      });

      if (response.ok) {
        this.isConnected = true;
        return true;
      } else {
        console.error('Failed to connect to Weaviate:', response.statusText);
        this.isConnected = false;
        return false;
      }
    } catch (error) {
      console.error('Failed to connect to Weaviate:', error);
      this.isConnected = false;
      return false;
    }
  }

  async getCollections(): Promise<string[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const response = await fetch(`${this.baseUrl}/schema`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const schema = await response.json();
      return schema.classes?.map((cls: any) => cls.class) || [];
    } catch (error) {
      console.error('Failed to get collections:', error);
      throw error;
    }
  }

  async getObjectsFromCollection(collectionName: string, limit: number = 100): Promise<WeaviateObject[]> {
    if (!this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const query = {
        query: `{
          Get {
            ${collectionName}(limit: ${limit}) {
              _additional {
                id
                vector
                creationTimeUnix
                lastUpdateTimeUnix
              }
            }
          }
        }`
      };

      const response = await fetch(`${this.baseUrl}/graphql`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(`GraphQL Error: ${result.errors[0].message}`);
      }

      const objects = result.data?.Get?.[collectionName] || [];

      return objects.map((obj: any) => ({
        id: obj._additional.id,
        class: collectionName,
        properties: Object.keys(obj).reduce((props: any, key) => {
          if (key !== '_additional') {
            props[key] = obj[key];
          }
          return props;
        }, {}),
        vector: obj._additional.vector,
        creationTimeUnix: obj._additional.creationTimeUnix,
        lastUpdateTimeUnix: obj._additional.lastUpdateTimeUnix,
      }));
    } catch (error) {
      console.error('Failed to get objects from collection:', error);
      throw error;
    }
  }

  async getCollectionSchema(collectionName: string): Promise<any> {
    if (!this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const response = await fetch(`${this.baseUrl}/schema/${collectionName}`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get collection schema:', error);
      throw error;
    }
  }

  async deleteCollection(collectionName: string): Promise<boolean> {
    if (!this.isConnected) {
      throw new Error('Not connected to Weaviate');
    }

    try {
      const response = await fetch(`${this.baseUrl}/schema/${collectionName}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to delete collection:', error);
      throw error;
    }
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    this.baseUrl = '';
    this.headers = {};
    this.isConnected = false;
  }
}

export const weaviateHttpService = new WeaviateHttpService();
