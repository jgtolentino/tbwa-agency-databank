"use client";

import React, { useState, ReactNode } from 'react';
import {
  Menu,
  X,
  Home,
  BarChart3,
  Map,
  Settings,
  Package,
  Users,
  Bell,
  Search,
  ChevronDown,
  Globe,
  Database,
  Zap,
  Eye,
  TrendingUp,
  Filter,
  Download,
  Share2,
  MoreHorizontal,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
}

interface UniformLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
  showSidebar?: boolean;
  sidebarCollapsed?: boolean;
  headerStyle?: 'default' | 'minimal' | 'dashboard';
  contentPadding?: 'default' | 'none' | 'large';
  fullWidth?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Dashboard',
    href: '/',
    icon: <Home className="w-5 h-5" />
  },
  {
    id: 'scout',
    label: 'Scout Analytics',
    href: '/dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    badge: 'v5.0',
    children: [
      { id: 'scout-overview', label: 'Overview', href: '/dashboard', icon: <Eye className="w-4 h-4" /> },
      { id: 'scout-optimized', label: 'Optimized View', href: '/dashboard/optimized', icon: <Zap className="w-4 h-4" /> }
    ]
  },
  {
    id: 'chartvision',
    label: 'ChartVision',
    href: '/chartvision',
    icon: <TrendingUp className="w-5 h-5" />,
    children: [
      { id: 'cv-gallery', label: 'Dashboard Gallery', href: '/chartvision', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'cv-metadata', label: 'Extraction Data', href: '/chartvision?tab=metadata', icon: <Database className="w-4 h-4" /> }
    ]
  },
  {
    id: 'geographic',
    label: 'Geographic Intel',
    href: '/geographic',
    icon: <Map className="w-5 h-5" />,
    badge: 'Enhanced'
  },
  {
    id: 'tailor-swiftly',
    label: 'Tailor Swiftly',
    href: '/tailor-swiftly',
    icon: <Package className="w-5 h-5" />,
    children: [
      { id: 'ts-arsenal', label: 'Feature Arsenal', href: '/tailor-swiftly?tab=arsenal', icon: <Settings className="w-4 h-4" /> },
      { id: 'ts-configurator', label: 'Order Sheet', href: '/tailor-swiftly?tab=configurator', icon: <Filter className="w-4 h-4" /> }
    ]
  },
  {
    id: 'test-bots',
    label: 'Test Bots',
    href: '/test-bots',
    icon: <Users className="w-5 h-5" />
  }
];

const UniformLayout: React.FC<UniformLayoutProps> = ({
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  showSidebar = true,
  sidebarCollapsed: initialCollapsed = false,
  headerStyle = 'default',
  contentPadding = 'default',
  fullWidth = false
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialCollapsed);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getSidebarWidth = () => {
    if (!showSidebar) return 'w-0';
    return sidebarCollapsed ? 'w-16' : 'w-64';
  };

  const getContentPadding = () => {
    switch (contentPadding) {
      case 'none': return 'p-0';
      case 'large': return 'p-8';
      default: return 'p-6';
    }
  };

  const renderNavigationItem = (item: NavigationItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <a
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group hover:bg-gray-100 ${
            depth > 0 ? 'ml-4' : ''
          }`}
          onClick={hasChildren ? (e) => { e.preventDefault(); toggleExpanded(item.id); } : undefined}
        >
          <div className="flex items-center gap-3 flex-1">
            {item.icon}
            {!sidebarCollapsed && (
              <>
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </div>
          {hasChildren && !sidebarCollapsed && (
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          )}
        </a>
        
        {hasChildren && isExpanded && !sidebarCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderNavigationItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {showSidebar && (
        <>
          {/* Desktop Sidebar */}
          <div className={`hidden lg:flex flex-col ${getSidebarWidth()} transition-all duration-300 bg-white border-r border-gray-200 fixed inset-y-0 z-50`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <Globe className="w-8 h-8 text-blue-600" />
                  <span className="font-bold text-lg text-gray-900">TBWA Intel</span>
                </div>
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navigationItems.map((item) => renderNavigationItem(item))}
            </nav>

            {!sidebarCollapsed && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    JT
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Jake Tolentino</p>
                    <p className="text-xs text-gray-500 truncate">Admin</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-50" onClick={toggleMobileMenu}>
              <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Globe className="w-8 h-8 text-blue-600" />
                    <span className="font-bold text-lg text-gray-900">TBWA Intel</span>
                  </div>
                  <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {navigationItems.map((item) => renderNavigationItem(item))}
                </nav>
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:ml-64' : ''} ${sidebarCollapsed && showSidebar ? 'lg:ml-16' : ''} transition-all duration-300`}>
        {/* Header */}
        <header className={`bg-white border-b border-gray-200 ${headerStyle === 'minimal' ? 'py-2' : 'py-4'} px-4 lg:px-6`}>
          <div className={`${fullWidth ? '' : 'max-w-7xl mx-auto'} flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              {showSidebar && (
                <button
                  onClick={toggleMobileMenu}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
                  {breadcrumbs && (
                    <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <span>/</span>}
                          {crumb.href ? (
                            <a href={crumb.href} className="hover:text-gray-700">{crumb.label}</a>
                          ) : (
                            <span>{crumb.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </nav>
                  )}
                </div>
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {headerStyle !== 'minimal' && (
                <>
                  <div className="hidden lg:flex relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>
                </>
              )}

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}

              <button className="p-2 rounded-lg hover:bg-gray-100">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 ${getContentPadding()} ${fullWidth ? '' : 'max-w-7xl mx-auto w-full'} overflow-auto`}>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className={`${fullWidth ? '' : 'max-w-7xl mx-auto'} flex items-center justify-between text-sm text-gray-500`}>
            <div className="flex items-center gap-4">
              <span>© 2025 TBWA Intelligence Platform</span>
              <span>•</span>
              <span>v5.0.0</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-gray-700">Support</a>
              <a href="#" className="hover:text-gray-700">Documentation</a>
              <a href="#" className="hover:text-gray-700">API</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UniformLayout;