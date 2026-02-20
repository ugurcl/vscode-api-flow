import * as vscode from "vscode";
import { SidebarToExtension, ExtensionToSidebar } from "../types/messages";
import { CollectionService } from "../services/collection.service";

export function createSidebarHandler(collectionService: CollectionService) {
  return function handleSidebarMessage(
    message: SidebarToExtension,
    view: vscode.WebviewView,
    onOpenRequest?: (requestId: string, collectionId: string) => void
  ) {
    const post = (msg: ExtensionToSidebar) => view.webview.postMessage(msg);

    switch (message.type) {
      case "getCollections":
        post({ type: "collectionsLoaded", payload: collectionService.getAll() });
        break;

      case "createCollection":
        collectionService.create(message.payload.name).then(() => {
          post({ type: "collectionsLoaded", payload: collectionService.getAll() });
        });
        break;

      case "deleteCollection":
        collectionService.remove(message.payload.collectionId).then(() => {
          post({ type: "collectionsLoaded", payload: collectionService.getAll() });
        });
        break;

      case "openRequest":
        onOpenRequest?.(message.payload.requestId, message.payload.collectionId);
        break;

      case "deleteRequest":
        collectionService
          .removeRequest(message.payload.collectionId, message.payload.requestId)
          .then(() => {
            post({ type: "collectionsLoaded", payload: collectionService.getAll() });
          });
        break;
    }
  };
}
