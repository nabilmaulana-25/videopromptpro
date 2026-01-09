
import React from 'react';
import { LayoutDashboard, Video, History, Settings, LogOut, Search, Bell, CreditCard } from 'lucide-react';
import { AppView, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onLogout?: () => void;
  user: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Workspace', icon: Video },
    { id: 'history', label: 'History', icon: History },
    { id: 'pricing', label: 'Plans & Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const waLink = "https://wa.me/6285591637198?text=Halo%20VideoPrompt%20Pro,%20saya%20ingin%20bertanya%20informasi%20lebih%20lanjut%20mengenai%20layanan%20AI%20ini.";

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-950 z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white italic shadow-lg shadow-indigo-600/20">V</div>
            <span className="text-lg font-bold tracking-tighter text-white italic">VideoPrompt<span className="text-indigo-500">PRO</span></span>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as AppView)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeView === item.id 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          {user.plan === 'Free' && (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-xl">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Upgrade</p>
              <p className="text-xs text-white font-medium mb-3">Unlock unlimited high-fidelity video analysis.</p>
              <button 
                onClick={() => setActiveView('pricing')}
                className="w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-zinc-100 transition-colors"
              >
                View Plans
              </button>
            </div>
          )}
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 text-zinc-500 hover:text-white text-sm transition-colors group px-3"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search projects or logs..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-600"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                System Live
              </span>
            </div>
            
            <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-zinc-950"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${user.plan === 'Free' ? 'bg-zinc-600' : 'bg-indigo-500'}`}></div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tighter">{user.plan} Account</p>
                </div>
              </div>
              <img src={user.avatar} className="w-8 h-8 rounded-full ring-2 ring-indigo-600/20 object-cover" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-950">
          {children}
        </div>

        {/* Floating WA Button */}
        <a 
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-50 group flex items-center gap-3"
        >
          <div className="bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-medium opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 pointer-events-none backdrop-blur-md shadow-2xl">
            Butuh info? Chat Admin
          </div>
          <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20 hover:scale-110 active:scale-95 transition-all duration-300 relative">
            <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:hidden"></div>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.432 5.628 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
        </a>
      </main>
    </div>
  );
};

export default Layout;
