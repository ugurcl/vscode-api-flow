import { SidebarApp } from "./components/sidebar/SidebarApp";
import { PanelApp } from "./components/panel/PanelApp";

export function App() {
  const root = document.getElementById("root");
  const viewType = root?.getAttribute("data-view");

  if (viewType === "sidebar") {
    return <SidebarApp />;
  }

  return <PanelApp />;
}
