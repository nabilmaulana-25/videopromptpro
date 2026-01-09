
import React from 'react';
import { ArrowUpRight, Plus, Zap, HardDrive, CreditCard } from 'lucide-react';
import { DashboardStats, UserProfile } from '../types';

interface DashboardProps {
  onStartNew: () => void;
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartNew, user }) => {
  const stats: DashboardStats = {
    totalAnalyzed: 124,
    promptsGenerated: 482,
    storageUsed: '4.2 GB',
    remainingCredits: 850
  };

  const recentAnalysis = [
    { title: 'Neon Cyberpunk City', date: '2 hours ago', type: 'Sci-fi', img: 'https://picsum.photos/seed/neo/400/225' },
    { title: 'Golden Hour Portrait', date: '5 hours ago', type: 'Realistic', img: 'https://picsum.photos/seed/port/400/225' },
    { title: 'Abstract Ocean Waves', date: 'Yesterday', type: 'Abstract', img: 'https://picsum.photos/seed/ocean/400/225' },
    { title: 'Forest Drone Shot', date: '2 days ago', type: 'Nature', img: 'https://picsum.photos/seed/forest/400/225' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 italic">Welcome Back, {user.name.split(' ')[0]}</h1>
          <p className="text-zinc-400">Ready to transform your next video into a masterpiece?</p>
        </div>
        <button 
          onClick={onStartNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Zap} label="Total Analyzed" value={stats.totalAnalyzed.toString()} trend="+12%" />
        <StatCard icon={Plus} label="Prompts Ready" value={stats.promptsGenerated.toString()} trend="+45" />
        <StatCard icon={HardDrive} label="Cloud Storage" value={stats.storageUsed} trend="15% Free" />
        <StatCard icon={CreditCard} label="API Credits" value={stats.remainingCredits.toString()} trend="Renew in 5d" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors">
            View All <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentAnalysis.map((item, idx) => (
            <div key={idx} className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all cursor-pointer">
              <div className="aspect-video relative overflow-hidden">
                <img src={item.img} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-semibold px-2 py-1 bg-indigo-600 rounded">Open Workspace</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{item.date}</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold bg-zinc-800 px-2 py-0.5 rounded">{item.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">Level up your engineering</h3>
            <p className="text-zinc-400 mb-6 max-w-md">Get high-fidelity prompts optimized for Midjourney v6 and stable diffusion XL in seconds. No more trial and error.</p>
            <button className="bg-white text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors">Upgrade to Enterprise</button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        </div>
        <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Invite Friends</h3>
            <p className="text-indigo-100/80 text-sm mb-6">Earn 100 free credits for every friend who signs up.</p>
            <div className="bg-indigo-500/30 p-4 rounded-xl border border-indigo-400/30 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-widest text-indigo-200 font-bold mb-1">Referral Link</p>
              <p className="text-sm font-mono truncate">videoprompt.pro/ref/{user.name.toLowerCase().replace(' ', '_')}</p>
            </div>
          </div>
          <Zap className="absolute -bottom-10 -right-10 text-indigo-400/20" size={200} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900 transition-colors">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{trend}</span>
    </div>
    <div>
      <p className="text-zinc-500 text-sm font-medium">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default Dashboard;
