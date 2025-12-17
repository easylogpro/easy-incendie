// src/layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Wrench, Users, Building2, FileText, Receipt, HardHat, Settings, LogOut, Bell, Search, Menu, X, Zap, Shield, ChevronLeft, ChevronRight, Download, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'SSI non conforme - Site Carrefour', type: 'danger', time: '2h' },
    { id: 2, title: 'Devis validé - Martin SAS', type: 'success', time: '4h' },
    { id: 3, title: 'Maintenance à planifier', type: 'warning', time: '1j' }
  ];

  const handleLogout = async () => {
    try { 
      await logout(); 
      setMobileMenuOpen(false);
      navigate('/login'); 
    } catch (error) { 
      console.error('Erreur déconnexion:', error); 
    }
  };

  // Menu principal
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Planning', path: '/planning', icon: Calendar },
    { name: 'Interventions', path: '/interventions', icon: Wrench, badge: 5 },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Sites', path: '/sites', icon: Building2 },
    { name: 'Devis', path: '/devis', icon: FileText, badge: 3 },
    { name: 'Factures', path: '/factures', icon: Receipt, badgeDanger: 2 },
    { name: 'Utilisateurs', path: '/utilisateurs', icon: HardHat },
    { name: 'Paramètres', path: '/settings', icon: Settings }
  ];

  // Menu secondaire (juste au-dessus des modules)
  const secondaryNavItems = [
    { name: 'Export Comptable', path: '/export-comptable', icon: Download },
    { name: 'Données Client', path: '/donnees-client', icon: Database }
  ];

  const modules = [
    { id: 'energie', name: 'Énergie', icon: Zap, active: true },
    { id: 'incendie', name: 'Incendie', icon: Shield, active: true }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <NavLink to={item.path} className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl mx-2 transition-all duration-200 relative ${isActive ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}`}>
        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
        {!sidebarCollapsed && (
          <>
            <span className="font-medium flex-1">{item.name}</span>
            {item.badge && <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive ? 'bg-white/30' : 'bg-white/20'}`}>{item.badge}</span>}
            {item.badgeDanger && <span className={`px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white`}>{item.badgeDanger}</span>}
          </>
        )}
        {sidebarCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">{item.name}</div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar Desktop avec fond dégradé */}
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 transition-all duration-300 ease-out z-40 hidden lg:flex flex-col ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-white">EasyLog Pro</h1>
                <p className="text-xs text-blue-200">Gestion Énergie</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (<NavItem key={item.path} item={item} />))}
        </nav>

        {/* Navigation secondaire + Modules actifs */}
        <div className="border-t border-white/10">
          {/* Export Comptable + Données Client */}
          <div className="py-3 space-y-1">
            {secondaryNavItems.map(item => (<NavItem key={item.path} item={item} />))}
          </div>

          {/* Modules actifs */}
          {!sidebarCollapsed && (
            <div className="px-4 py-3 border-t border-white/10">
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Modules actifs</p>
              <div className="flex flex-wrap gap-2">
                {modules.filter(m => m.active).map(module => (
                  <span key={module.id} className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg text-xs font-medium text-white">
                    <module.icon className="w-3 h-3" />{module.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold shadow-lg">
              {userData?.prenom?.[0] || 'U'}{userData?.nom?.[0] || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{userData?.prenom} {userData?.nom}</p>
                <p className="text-xs text-blue-200 truncate">{userData?.role}</p>
              </div>
            )}
            <button onClick={handleLogout} className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors" title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">EasyLog Pro</span>
        </div>
        <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMobileMenuOpen(false)} />}

      {/* Mobile Sidebar - COMPLET avec modules + user + déconnexion */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 z-50 transform transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header mobile sidebar */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-white">EasyLog Pro</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation principale mobile - scrollable */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={() => setMobileMenuOpen(false)} 
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 mx-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium flex-1">{item.name}</span>
              {item.badge && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-white/20">{item.badge}</span>}
              {item.badgeDanger && <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">{item.badgeDanger}</span>}
            </NavLink>
          ))}
          
          {/* Menu secondaire */}
          <div className="border-t border-white/10 mt-2 pt-2 mx-2">
            {secondaryNavItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                onClick={() => setMobileMenuOpen(false)} 
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Modules actifs mobile */}
        <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
          <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Modules actifs</p>
          <div className="flex flex-wrap gap-2">
            {modules.filter(m => m.active).map(module => (
              <span key={module.id} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm font-medium text-white">
                <module.icon className="w-4 h-4" />{module.name}
              </span>
            ))}
          </div>
        </div>

        {/* User + Déconnexion mobile */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userData?.prenom?.[0] || 'U'}{userData?.nom?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{userData?.prenom} {userData?.nom}</p>
              <p className="text-sm text-blue-200 truncate">{userData?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Top Bar Desktop */}
      <header className={`hidden lg:flex fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 items-center justify-between px-6 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-64'}`}>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-2 border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 focus:outline-none" />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded">⌘K</kbd>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Notifications</h3></div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'danger' ? 'bg-red-500' : ''} ${notif.type === 'success' ? 'bg-emerald-500' : ''} ${notif.type === 'warning' ? 'bg-amber-500' : ''}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Il y a {notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700">Voir toutes les notifications</button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div>
              <p className="text-sm font-medium text-gray-900 text-right">{userData?.prenom} {userData?.nom}</p>
              <p className="text-xs text-gray-500 text-right">{userData?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
              {userData?.prenom?.[0] || 'U'}{userData?.nom?.[0] || 'A'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`pt-16 lg:pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <div className="p-4 lg:p-6"><Outlet /></div>
      </main>
    </div>
  );
};

export default MainLayout;
