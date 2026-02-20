interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-vscode-border">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-3 py-1.5 text-sm border-b-2 transition-colors ${
            activeTab === tab
              ? "border-vscode-button-bg text-vscode-fg"
              : "border-transparent text-vscode-fg opacity-50 hover:opacity-80"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
