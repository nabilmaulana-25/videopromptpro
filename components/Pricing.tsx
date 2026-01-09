
import React, { useState, useRef } from 'react';
import { Check, Zap, Shield, Crown, Building2, QrCode, CreditCard, Smartphone, MessageCircle, X, ArrowRight, Copy, Upload, Loader2, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface PricingProps {
  user: UserProfile;
  onPlanUpdate: (plan: UserProfile['plan']) => void;
}

type PaymentStep = 'method' | 'details' | 'verifying' | 'success';

const Pricing: React.FC<PricingProps> = ({ user, onPlanUpdate }) => {
  const [selectedPlan, setSelectedPlan] = useState<UserProfile['plan'] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'dana' | 'bca' | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('method');
  const [transactionId] = useState(() => `VP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  const [proofUploaded, setProofUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plans = [
    {
      name: 'Free' as const,
      price: '0',
      description: 'Perfect for exploring the possibilities of AI video analysis.',
      features: ['3 Video analysis / mo', '720p Resolution support', 'Basic prompts', 'Community access'],
      icon: Zap,
      color: 'zinc',
    },
    {
      name: 'Standard' as const,
      price: '19',
      description: 'Ideal for content creators and small social media managers.',
      features: ['20 Video analysis / mo', '1080p Resolution support', 'SDXL+MJ prompts', 'Email support'],
      icon: Shield,
      color: 'indigo',
    },
    {
      name: 'Pro' as const,
      price: '49',
      description: 'The ultimate tool for professional filmmakers and agencies.',
      features: ['Unlimited analysis', '4K Resolution support', 'Priority API processing', 'Advanced Veo prompts', 'Priority support'],
      icon: Crown,
      color: 'purple',
      popular: true,
    },
    {
      name: 'Enterprise' as const,
      price: 'Custom',
      description: 'Tailored solutions for large-scale production houses.',
      features: ['White-label reports', 'Custom API integration', 'Dedicated account manager', 'On-premise deployment'],
      icon: Building2,
      color: 'emerald',
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.name === 'Enterprise') {
      window.open('https://wa.me/6285591637198?text=Halo%20VideoPrompt%20Pro,%20saya%20ingin%20bertanya%20mengenai%20paket%20Enterprise.%20ID%20User:%20' + user.email, '_blank');
      return;
    }
    if (plan.name === 'Free') {
      onPlanUpdate('Free');
      return;
    }
    setSelectedPlan(plan.name);
    setPaymentStep('method');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleConfirmPayment = () => {
    setPaymentStep('verifying');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        onPlanUpdate(selectedPlan!);
        setSelectedPlan(null);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4 italic tracking-tight">Choose Your Power</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Scale your content engineering with precision. Professional tools for professional results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = user.plan === plan.name;

          return (
            <div 
              key={plan.name}
              className={`relative bg-zinc-900/40 border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-zinc-800'} rounded-3xl p-8 flex flex-col transition-all hover:-translate-y-1`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-indigo-600/20">
                  Most Popular
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                plan.color === 'indigo' ? 'bg-indigo-600/10 text-indigo-500' : 
                plan.color === 'purple' ? 'bg-purple-600/10 text-purple-500' :
                plan.color === 'emerald' ? 'bg-emerald-600/10 text-emerald-500' :
                'bg-zinc-800 text-zinc-400'
              }`}>
                <Icon size={24} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-white">{plan.price !== 'Custom' ? `$${plan.price}` : plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-zinc-500 text-sm">/mo</span>}
              </div>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{plan.description}</p>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Check size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={isCurrent}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  isCurrent 
                    ? 'bg-zinc-800 text-zinc-500 cursor-default'
                    : plan.name === 'Enterprise'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isCurrent ? 'Active Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                {!isCurrent && <ArrowRight size={16} />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedPlan(null)}></div>
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[32px] overflow-hidden relative z-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-white italic">Premium Checkout</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Ref: {transactionId}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-8">
              {paymentStep === 'method' && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-8 bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-inner">
                    <div>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Selected Plan</p>
                      <p className="text-xl font-bold text-white italic">VideoPrompt {selectedPlan}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${selectedPlan === 'Standard' ? '19' : '49'}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Billed Monthly</p>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Secure Payment Methods</h3>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <PaymentMethodBtn 
                      active={paymentMethod === 'qris'} 
                      onClick={() => setPaymentMethod('qris')} 
                      icon={QrCode} 
                      label="QRIS" 
                    />
                    <PaymentMethodBtn 
                      active={paymentMethod === 'dana'} 
                      onClick={() => setPaymentMethod('dana')} 
                      icon={Smartphone} 
                      label="DANA" 
                    />
                    <PaymentMethodBtn 
                      active={paymentMethod === 'bca'} 
                      onClick={() => setPaymentMethod('bca')} 
                      icon={CreditCard} 
                      label="BCA" 
                    />
                  </div>

                  <button 
                    disabled={!paymentMethod}
                    onClick={() => setPaymentStep('details')}
                    className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {paymentStep === 'details' && paymentMethod && (
                <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
                  <button onClick={() => setPaymentStep('method')} className="text-zinc-500 hover:text-white text-xs font-bold flex items-center gap-1 mb-2">
                    <X size={14} className="rotate-90" /> Back to methods
                  </button>

                  {paymentMethod === 'qris' && (
                    <div className="bg-white p-6 rounded-3xl flex flex-col items-center">
                      <div className="w-56 h-56 bg-zinc-100 rounded-2xl flex items-center justify-center border-4 border-zinc-50 mb-4 overflow-hidden">
                        <QrCode size={180} className="text-black" />
                      </div>
                      <p className="text-black font-black text-lg">Scan QRIS to Pay</p>
                      <p className="text-zinc-400 text-[10px] text-center mt-1 uppercase tracking-tight max-w-xs font-medium">Auto-detects DANA, OVO, GoPay, ShopeePay & All Mobile Banking</p>
                    </div>
                  )}

                  {paymentMethod === 'dana' && (
                    <div className="bg-[#008CFF]/5 border border-[#008CFF]/20 p-8 rounded-3xl text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#008CFF]/10 blur-[60px] rounded-full"></div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" alt="DANA" className="h-10 mx-auto mb-6" />
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Phone Number</p>
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <p className="text-3xl font-mono font-black text-white tracking-widest">085591637198</p>
                        <button onClick={() => copyToClipboard('085591637198')} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Copy size={18} className="text-[#008CFF]" />
                        </button>
                      </div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Total Amount: ${selectedPlan === 'Standard' ? '19' : '49'}</p>
                    </div>
                  )}

                  {paymentMethod === 'bca' && (
                    <div className="bg-[#0060AF]/5 border border-[#0060AF]/20 p-8 rounded-3xl text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0060AF]/10 blur-[60px] rounded-full"></div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-10 mx-auto mb-6" />
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Virtual Account / Rekening</p>
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <p className="text-3xl font-mono font-black text-white tracking-widest">0184422766</p>
                        <button onClick={() => copyToClipboard('0184422766')} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Copy size={18} className="text-[#0060AF]" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-zinc-400 mb-6">a/n VideoPrompt Pro</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Step 2: Upload Payment Proof</h4>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        proofUploaded ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'
                      }`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" onChange={() => setProofUploaded(true)} />
                      {proofUploaded ? (
                        <>
                          <CheckCircle className="text-emerald-500 mb-2" size={24} />
                          <p className="text-emerald-500 text-xs font-bold">Payment Proof Attached</p>
                        </>
                      ) : (
                        <>
                          <Upload className="text-zinc-600 mb-2" size={24} />
                          <p className="text-zinc-500 text-xs font-bold">Click to upload screenshot</p>
                        </>
                      )}
                    </div>
                  </div>

                  <button 
                    disabled={!proofUploaded}
                    onClick={handleConfirmPayment}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    Confirm & Send for Verification
                  </button>
                </div>
              )}

              {paymentStep === 'verifying' && (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-300">
                  <div className="relative mb-8">
                    <Loader2 className="text-indigo-500 animate-spin" size={64} />
                    <Shield className="absolute inset-0 m-auto text-white/20" size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Verifying Payment</h3>
                  <p className="text-zinc-500 text-sm max-w-xs">Our secure system is validating your transaction with the provider. Please do not close this window.</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                    <Check size={40} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 italic">Upgrade Confirmed!</h3>
                  <p className="text-zinc-400 text-sm mb-2">Welcome to the {selectedPlan} Tier.</p>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Applying changes to your profile...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentMethodBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
      active 
        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-500 shadow-lg shadow-indigo-500/5' 
        : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400'
    }`}
  >
    <Icon size={28} className="mb-2" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Pricing;
