import { useSearchParams } from "react-router";
import { ComputerSection } from "../sections/misc-computer.section";
import { ServerUnitSection } from "../sections/misc-server-unit.section";
import {
  miscPageContent,
  miscPageLayout,
  miscPageSidebar,
  miscPageTab,
  miscPageTabIcon,
} from "./misc.page.css";

type Tab = "computer" | "server-unit";

const tabSearchParam = "tab";

function getTabFromParams(value: string | null): Tab {
  if (value === "server-unit") return "server-unit";
  return "computer";
}

export default function MiscPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getTabFromParams(searchParams.get(tabSearchParam));

  const setActiveTab = (tab: Tab) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(tabSearchParam, tab);
    setSearchParams(nextParams);
  };

  return (
    <div className={miscPageLayout}>
      <nav className={miscPageSidebar}>
        <button
          type="button"
          className={miscPageTab}
          data-active={activeTab === "computer"}
          onClick={() => setActiveTab("computer")}
        >
          <span className={miscPageTabIcon}>🖥</span>
          <span>Computer</span>
        </button>
        <button
          type="button"
          className={miscPageTab}
          data-active={activeTab === "server-unit"}
          onClick={() => setActiveTab("server-unit")}
        >
          <span className={miscPageTabIcon}>🗄</span>
          <span>Server</span>
        </button>
      </nav>
      <main className={miscPageContent}>
        {activeTab === "computer" ? <ComputerSection /> : <ServerUnitSection />}
      </main>
    </div>
  );
}
