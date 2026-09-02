import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Activity, User, Moon, Sun, Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-main font-sans selection:bg-brand/30 transition-colors duration-300 flex flex-col">
      <nav className="border-b border-border-dark bg-bg-deep sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left Brand Area */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand shrink-0" />
                <div className="flex flex-col leading-tight">
                  <span className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-text-main uppercase">AI Disaster Intelligence</span>
                  <span className="hidden xs:block text-[9px] text-text-muted uppercase tracking-widest">Emergency Analysis Platform</span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-1 ml-4 border-l border-border-dark pl-4 h-8 transition-colors">
                <NavItem to="/" label="Dashboard" />
                <NavItem to="/thermal-detection" label="Thermal Detection" />
                <NavItem to="/building-damage" label="Building Damage" />
                <NavItem to="/history" label="History" />
              </div>
            </div>

            {/* Right Status Area */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-text-muted">
                <span>System Status</span>
                <span className="flex items-center gap-1.5 text-brand">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand"></span> Operational
                </span>
              </div>
              
              <div className="w-px h-4 bg-border-dark hidden md:block"></div>
              
              <button 
                onClick={toggleTheme}
                className="text-text-sec hover:text-text-main transition-colors p-2 rounded-md hover:bg-bg-charcoal"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button className="hidden sm:block text-text-sec hover:text-text-main transition-colors p-2 rounded-md hover:bg-bg-charcoal">
                <User className="w-4 h-4" />
              </button>

              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-text-sec hover:text-text-main transition-colors p-2 rounded-md hover:bg-bg-charcoal"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
            
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border-dark bg-bg-charcoal">
            <div className="px-4 pt-2 pb-4 space-y-1">
              <MobileNavItem to="/" label="Dashboard" />
              <MobileNavItem to="/thermal-detection" label="Thermal Detection" />
              <MobileNavItem to="/building-damage" label="Building Damage" />
              <MobileNavItem to="/history" label="History" />
            </div>
            <div className="px-4 py-3 border-t border-border-dark flex items-center justify-between sm:hidden text-xs text-text-muted">
              <span>System Status</span>
              <span className="flex items-center gap-1.5 text-brand font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand"></span> Operational
              </span>
            </div>
          </div>
        )}
      </nav>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ to, label }) => (
  <NavLink 
    to={to} 
    className={({isActive}) => `
      px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap
      ${isActive 
        ? 'bg-brand/10 text-brand' 
        : 'text-text-sec hover:text-text-main hover:bg-bg-charcoal'
      }
    `}
  >
    {label}
  </NavLink>
);

const MobileNavItem = ({ to, label }) => (
  <NavLink 
    to={to} 
    className={({isActive}) => `
      block px-3 py-2.5 rounded-md text-sm font-medium transition-colors
      ${isActive 
        ? 'bg-brand/10 text-brand' 
        : 'text-text-sec hover:text-text-main hover:bg-bg-surface'
      }
    `}
  >
    {label}
  </NavLink>
);

export default MainLayout;
