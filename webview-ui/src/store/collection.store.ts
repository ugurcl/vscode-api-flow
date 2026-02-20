import { create } from "zustand";

interface CollectionRequest {
  id: string;
  name: string;
  method: string;
  [key: string]: unknown;
}

interface Collection {
  id: string;
  name: string;
  requests: CollectionRequest[];
}

interface CollectionState {
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
}

export const useCollectionStore = create<CollectionState>((set) => ({
  collections: [],
  setCollections: (collections) => set({ collections }),
}));
