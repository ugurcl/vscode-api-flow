import { StorageService } from "./storage.service";
import { Collection, SavedRequest } from "../types/models";

const COLLECTIONS_KEY = "apiFlow.collections";

export class CollectionService {
  constructor(private storage: StorageService) {}

  getAll(): Collection[] {
    return this.storage.get<Collection[]>(COLLECTIONS_KEY) ?? [];
  }

  async create(name: string): Promise<Collection> {
    const collections = this.getAll();
    const collection: Collection = {
      id: crypto.randomUUID(),
      name,
      requests: [],
    };
    collections.push(collection);
    await this.storage.set(COLLECTIONS_KEY, collections);
    return collection;
  }

  async remove(collectionId: string): Promise<void> {
    const collections = this.getAll().filter((c) => c.id !== collectionId);
    await this.storage.set(COLLECTIONS_KEY, collections);
  }

  async rename(collectionId: string, name: string): Promise<void> {
    const collections = this.getAll();
    const collection = collections.find((c) => c.id === collectionId);
    if (collection) {
      collection.name = name;
      await this.storage.set(COLLECTIONS_KEY, collections);
    }
  }

  async saveRequest(collectionId: string, request: SavedRequest): Promise<void> {
    const collections = this.getAll();
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;

    const existingIndex = collection.requests.findIndex((r) => r.id === request.id);
    if (existingIndex >= 0) {
      collection.requests[existingIndex] = request;
    } else {
      collection.requests.push(request);
    }
    await this.storage.set(COLLECTIONS_KEY, collections);
  }

  async removeRequest(collectionId: string, requestId: string): Promise<void> {
    const collections = this.getAll();
    const collection = collections.find((c) => c.id === collectionId);
    if (!collection) return;

    collection.requests = collection.requests.filter((r) => r.id !== requestId);
    await this.storage.set(COLLECTIONS_KEY, collections);
  }

  getRequest(collectionId: string, requestId: string): SavedRequest | undefined {
    const collection = this.getAll().find((c) => c.id === collectionId);
    return collection?.requests.find((r) => r.id === requestId);
  }
}
