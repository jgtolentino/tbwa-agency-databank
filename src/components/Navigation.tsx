import { Button } from "@/components/ui/button";
import { Brain, Settings, User, Search, Bell } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-nav-bg text-nav-text px-6 py-4 border-b border-tbwa-gray/20">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-tbwa-yellow" />
          <div>
            <h1 className="text-xl font-bold">LIONS Intelligence</h1>
            <p className="text-xs text-tbwa-gray">TBWA\SMP</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tbwa-gray" />
            <input
              type="text"
              placeholder="Search insights, reports, or campaigns..."
              className="w-full pl-10 pr-4 py-2 bg-tbwa-gray/10 border border-tbwa-gray/20 rounded-lg text-nav-text placeholder-tbwa-gray focus:outline-none focus:border-tbwa-yellow focus:ring-1 focus:ring-tbwa-yellow"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-nav-text hover:text-nav-hover">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-nav-text hover:text-nav-hover">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-nav-text hover:text-nav-hover">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;