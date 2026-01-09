
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import Auth from './components/Auth';
import Pricing from './components/Pricing';
import { AppView, UserProfile } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vp_pro_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('vp_pro_user');
      }
    }
    setIsInitialLoad(false);
  }, []);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Save to local storage for persistence
    localStorage.setItem('vp_pro_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('dashboard');
    localStorage.removeItem('vp_pro_user');
  };

  const updatePlan = (newPlan: UserProfile['plan']) => {
    if (user) {
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      localStorage.setItem('vp_pro_user', JSON.stringify(updatedUser));
      setActiveView('dashboard');
    }
  };

  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-800 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard user={user} onStartNew={() => setActiveView('workspace')} />;
      case 'workspace':
        return <Workspace />;
      case 'pricing':
        return <Pricing user={user} onPlanUpdate={updatePlan} />;
      case 'history':
        return (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <h2 className="text-xl font-bold mb-2 italic tracking-tight">Analysis Vault</h2>
            <p>Your previous high-fidelity reports will be stored here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white italic">Settings</h2>
              <button 
                onClick={() => setActiveView('pricing')}
                className="bg-indigo-600/10 text-indigo-400 text-xs font-bold px-4 py-2 rounded-full border border-indigo-500/20 hover:bg-indigo-600/20 transition-all"
              >
                Upgrade Plan
              </button>
            </div>
            <section className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
              <h3 className="font-semibold text-white mb-4">Account Profile</h3>
              <div className="flex items-center gap-4 mb-6">
                <img src={user.avatar} className="w-16 h-16 rounded-full ring-4 ring-zinc-800 object-cover" alt="Profile" />
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-zinc-500 text-sm">{user.email}</p>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-4">API Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">Gemini API Connection</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="password" 
                      value="••••••••••••••••" 
                      disabled 
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-sm text-zinc-400"
                    />
                    <span className="text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return <Dashboard user={user} onStartNew={() => setActiveView('workspace')} />;
    }
  };

  return (
    <Layout 
      user={user}
      activeView={activeView} 
      setActiveView={setActiveView} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
