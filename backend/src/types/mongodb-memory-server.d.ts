declare module 'mongodb-memory-server' {
    import { MongoClient } from 'mongodb';
    export class MongoMemoryServer {
      static create(): Promise<MongoMemoryServer>;
      static getUri(): string;
      stop(): Promise<void>;
    }
  }
  