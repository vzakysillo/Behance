interface TabBarProps {
  tabs: readonly string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex items-center border-b border-stone-200 px-[50px]">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={[
            "text-base font-normal text-black py-4 mr-[69px] border-b-2 -mb-px transition-colors whitespace-nowrap",
            activeTab === tab ? "border-black" : "border-transparent hover:border-stone-300",
          ].join(" ")}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
