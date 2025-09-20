interface Tab {
  id: string
  label: string
  icon?: string
}

interface TabNavProps {
  tabs: readonly Tab[]
  activeTab: string
  onSelect: (tabId: string) => void
}

export function TabNav({ tabs, activeTab, onSelect }: TabNavProps) {
  return (
    <nav className="tab-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </nav>
  )
}