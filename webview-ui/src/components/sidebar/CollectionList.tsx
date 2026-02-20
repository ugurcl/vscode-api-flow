import { useCollectionStore } from "../../store/collection.store";
import { CollectionItem } from "./CollectionItem";

export function CollectionList() {
  const collections = useCollectionStore((s) => s.collections);

  if (collections.length === 0) {
    return (
      <div className="text-sm opacity-50 text-center py-8">
        No collections yet
      </div>
    );
  }

  return (
    <div>
      {collections.map((collection) => (
        <CollectionItem
          key={collection.id}
          id={collection.id}
          name={collection.name}
          requests={collection.requests}
        />
      ))}
    </div>
  );
}
