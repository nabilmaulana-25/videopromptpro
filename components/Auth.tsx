
import React, { useState, useEffect } from 'react';
import { Zap, Chrome, MessageCircle, ArrowRight, ChevronLeft, User, Mail, Loader2, Eye, EyeOff, ShieldCheck, Lock, Globe, ShieldAlert, Smartphone, RefreshCw, Bell, X } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup';
type AuthMethod = 'selection' | 'whatsapp' | 'google-popup' | 'otp' | 'google-signin' | 'complete-profile';
type GooglePopupStep = 'loading' | 'email-entry' | 'password-entry' | 'google-2fa';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [method, setMethod] = useState<AuthMethod>('selection');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupStep, setPopupStep] = useState<GooglePopupStep>('loading');
  const [googleOtp, setGoogleOtp] = useState(['', '', '', '', '', '']);
  const [waOtp, setWaOtp] = useState(['', '', '', '', '', '']);
  const [activeNotification, setActiveNotification] = useState<{show: boolean, code: string, type: 'gmail' | 'whatsapp'}>({ 
    show: false, 
    code: '', 
    type: 'gmail' 
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setMethod('selection');
  };

  const startGoogleFlow = () => {
    setMethod('google-popup');
    setPopupStep('loading');
    setTimeout(() => {
      setPopupStep('email-entry');
    }, 1200);
  };

  const generateAndSendCode = (type: 'gmail' | 'whatsapp') => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveNotification({ show: true, code: newCode, type });
    // Notifikasi hilang otomatis setelah 8 detik
    setTimeout(() => setActiveNotification(prev => ({ ...prev, show: false })), 8000);
  };

  const handleGoogleEmailNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPopupStep('password-entry');
    }, 1000);
  };

  const handleGooglePasswordNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPopupStep('google-2fa');
      generateAndSendCode('gmail');
    }, 1200);
  };

  const handleGoogleFinalAuth = () => {
    const enteredCode = googleOtp.join('');
    if (enteredCode !== activeNotification.code) {
      alert("Verification code incorrect. Please check the notification at the top.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'signup') {
        setMethod('complete-profile');
      } else {
        onLogin({
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          avatar: `https://i.pravatar.cc/150?u=${email}`,
          plan: 'Pro'
        });
      }
    }, 1500);
  };

  const requestWaCode = () => {
    if (!phoneNumber) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMethod('otp');
      generateAndSendCode('whatsapp');
    }, 1500);
  };

  const verifyWaOtp = () => {
    const enteredCode = waOtp.join('');
    if (enteredCode !== activeNotification.code) {
      alert("Invalid WhatsApp security code. Check your top notification.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin({
        name: `User +62${phoneNumber.slice(-4)}`,
        email: `${phoneNumber}@whatsapp.com`,
        avatar: `https://picsum.photos/seed/${phoneNumber}/40`,
        plan: 'Pro'
      });
    }, 1000);
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin({
        name: fullName,
        email: email,
        avatar: `https://picsum.photos/seed/${fullName}/100`,
        plan: 'Free'
      });
    }, 1500);
  };

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (mode === 'signup') {
        setMethod('complete-profile');
        setIsSubmitting(false);
      } else {
        onLogin({
          name: email.split('@')[0],
          email: email,
          avatar: `https://picsum.photos/seed/${email}/40`,
          plan: 'Free'
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden text-zinc-100 font-sans">
      
      {/* SIMULATED SYSTEM NOTIFICATION (Gmail or WhatsApp) */}
      {activeNotification.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm animate-in slide-in-from-top-full duration-500">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-2xl flex items-start gap-4 backdrop-blur-xl">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg ${
              activeNotification.type === 'gmail' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-[#25D366] shadow-[#25D366]/20'
            }`}>
              {activeNotification.type === 'gmail' ? <Mail size={20} /> : <MessageCircle size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${
                  activeNotification.type === 'gmail' ? 'text-indigo-400' : 'text-[#25D366]'
                }`}>
                  {activeNotification.type === 'gmail' ? 'Gmail' : 'WhatsApp'}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium tracking-tight">Just now</span>
              </div>
              <p className="text-sm font-bold text-white mb-0.5">
                {activeNotification.type === 'gmail' ? 'Google Verification' : 'VideoPrompt Security'}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your secure code is: <span className="text-white font-mono font-black text-base ml-1">{activeNotification.code}</span>
              </p>
            </div>
            <button onClick={() => setActiveNotification(prev => ({ ...prev, show: false }))} className="text-zinc-600 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/30 transform -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer group">
            <Zap className="text-white group-hover:scale-110 transition-transform" size={40} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter italic">VideoPrompt <span className="text-indigo-500">PRO</span></h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">The High-Fidelity Prompt Engineering Suite</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-3xl p-8 rounded-[40px] shadow-2xl min-h-[460px] flex flex-col justify-center relative overflow-hidden">
          
          {method === 'selection' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center mb-4">
                <div className="flex justify-center mb-3">
                  <div className="px-3 py-1 bg-zinc-800 rounded-full flex items-center gap-1.5 border border-zinc-700">
                    <Lock size={10} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Secure Protocol v2.4</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{mode === 'login' ? 'Welcome Back' : 'Create Pro Account'}</h2>
                <p className="text-zinc-500 text-xs font-medium">Select your preferred authentication gateway</p>
              </div>

              <div className="space-y-3">
                <button onClick={startGoogleFlow} className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-black font-black py-4 rounded-2xl transition-all active:scale-95 shadow-xl shadow-white/5 group">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
                <button onClick={() => setMethod('whatsapp')} className="w-full flex items-center justify-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 border border-zinc-700/50 group">
                  <MessageCircle size={20} className="text-[#25D366] group-hover:scale-110 transition-transform" />
                  Continue with WhatsApp
                </button>
              </div>

              <div className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                <span className="relative bg-[#0c0c0e] px-4 text-[10px] uppercase font-black tracking-[0.3em] text-zinc-600">Manual Entry</span>
              </div>

              <button 
                onClick={() => setMethod('google-signin')}
                className="w-full text-zinc-500 hover:text-white text-xs font-bold transition-colors py-2"
              >
                Sign in with Username/Email
              </button>

              <div className="text-center pt-2">
                <p className="text-zinc-500 text-sm">
                  {mode === 'login' ? "New to VideoPrompt?" : "Already have an account?"}
                  <button onClick={toggleMode} className="ml-2 text-indigo-500 font-black hover:text-indigo-400">
                    {mode === 'login' ? "Register Now" : "Log In"}
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* SIMULATED GOOGLE POPUP */}
          {method === 'google-popup' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-white w-full max-w-[400px] min-h-[520px] rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col relative">
                {popupStep === 'loading' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-12 h-12 mb-6" />
                    <div className="w-10 h-10 border-4 border-zinc-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-600 font-medium text-sm">Initializing secure connection...</p>
                  </div>
                )}

                {popupStep === 'email-entry' && (
                  <div className="flex flex-col h-full flex-1 animate-in slide-in-from-right-4">
                    <div className="p-8 pb-4 text-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 mx-auto mb-6" />
                      <h3 className="text-2xl font-normal text-zinc-800">Sign in</h3>
                      <p className="text-base text-zinc-800 mt-2">Use your Google Account</p>
                    </div>
                    
                    <form onSubmit={handleGoogleEmailNext} className="flex-1 p-8 pt-6 space-y-8">
                      <div className="relative">
                        <input 
                          type="email" 
                          required
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-zinc-300 rounded-md py-4 px-4 text-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all placeholder:text-zinc-500"
                          placeholder="Email or phone"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-8">
                        <button type="button" className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-4 py-2 rounded-md transition-colors">Create account</button>
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-indigo-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Next'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {popupStep === 'password-entry' && (
                  <div className="flex flex-col h-full flex-1 animate-in slide-in-from-right-4">
                    <div className="p-8 pb-4 text-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 mx-auto mb-6" />
                      <h3 className="text-2xl font-normal text-zinc-800">Welcome</h3>
                      <div className="flex items-center justify-center gap-2 mt-4 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full w-fit mx-auto">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-600 font-bold uppercase">
                          {email.charAt(0)}
                        </div>
                        <span className="text-sm text-zinc-700 font-medium">{email}</span>
                      </div>
                    </div>
                    
                    <form onSubmit={handleGooglePasswordNext} className="flex-1 p-8 pt-6 space-y-8">
                      <div className="relative group">
                        <input 
                          type={showPassword ? "text" : "password"}
                          required
                          autoFocus
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full border border-zinc-300 rounded-md py-4 px-4 text-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
                          placeholder="Enter your password"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-4 text-zinc-400 hover:text-zinc-600"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-16">
                        <button type="button" className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-4 py-2 rounded-md transition-colors">Forgot password?</button>
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-indigo-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Next'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {popupStep === 'google-2fa' && (
                  <div className="flex flex-col h-full flex-1 animate-in slide-in-from-right-4">
                    <div className="p-8 pb-4 text-center">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 mx-auto mb-6" />
                      <h3 className="text-2xl font-normal text-zinc-800">2-Step Verification</h3>
                      <p className="text-sm text-zinc-600 mt-2">A code was sent to <span className="font-bold text-zinc-800">{email}</span></p>
                    </div>

                    <div className="flex-1 p-8 pt-2 space-y-6">
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-zinc-100 shadow-sm mb-4">
                          <Mail className="text-indigo-600" size={32} />
                        </div>
                        <div className="flex gap-2 mb-4">
                          {googleOtp.map((digit, idx) => (
                            <input 
                              key={idx}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const newOtp = [...googleOtp];
                                newOtp[idx] = e.target.value;
                                setGoogleOtp(newOtp);
                              }}
                              className="w-10 h-12 border border-zinc-300 rounded-md text-center text-xl font-bold text-zinc-800 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
                            />
                          ))}
                        </div>
                        <button 
                          onClick={() => generateAndSendCode('gmail')}
                          className="text-indigo-600 text-sm font-semibold flex items-center gap-1.5 hover:underline"
                        >
                          <RefreshCw size={14} />
                          Resend Code to Email
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-10">
                        <button type="button" className="text-indigo-600 font-semibold text-sm hover:bg-indigo-50 px-4 py-2 rounded-md transition-colors">Try another way</button>
                        <button 
                          onClick={handleGoogleFinalAuth}
                          disabled={isSubmitting}
                          className="bg-indigo-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setMethod('selection')}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          )}

          {method === 'whatsapp' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <button onClick={() => setMethod('selection')} className="text-zinc-500 flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"><ChevronLeft size={14} /> Back</button>
              <h2 className="text-2xl font-black text-white italic tracking-tight">WhatsApp <span className="text-[#25D366]">Secure</span></h2>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 font-black">+62</span>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  placeholder="855 9163 7198" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-5 pl-14 pr-4 text-white focus:border-[#25D366] outline-none font-mono text-lg font-bold" 
                />
              </div>
              <button onClick={requestWaCode} disabled={!phoneNumber || isSubmitting} className="w-full bg-[#25D366] text-[#075e54] font-black py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-[#25D366]/20">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Request Access Code'}
              </button>
            </div>
          )}

          {method === 'otp' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 text-center">
              <h2 className="text-2xl font-black text-white italic">Verify</h2>
              <p className="text-zinc-500 text-sm">WhatsApp code sent to <span className="text-white font-bold">+62 {phoneNumber}</span></p>
              <div className="flex justify-between gap-2">
                {waOtp.map((digit, idx) => (
                  <input 
                    key={idx} 
                    type="text" 
                    maxLength={1} 
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...waOtp];
                      newOtp[idx] = e.target.value;
                      setWaOtp(newOtp);
                    }}
                    className="w-11 h-14 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xl font-bold text-white focus:border-[#25D366] outline-none transition-all" 
                  />
                ))}
              </div>
              <button onClick={verifyWaOtp} disabled={isSubmitting} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl active:scale-95 shadow-xl shadow-indigo-600/30">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Complete Sign In'}
              </button>
              <button 
                onClick={() => generateAndSendCode('whatsapp')} 
                className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Resend code to WhatsApp
              </button>
            </div>
          )}

          {method === 'complete-profile' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="text-center mb-2">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="text-emerald-500" size={24} />
                </div>
                <h2 className="text-2xl font-black text-white italic tracking-tight">Final Step</h2>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Setup your professional workspace</p>
              </div>
              <form onSubmit={handleCompleteProfile} className="space-y-4">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-zinc-500 mb-2 tracking-widest">Professional Identity</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                      <input 
                        type="text" 
                        required 
                        autoFocus
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="Full Name" 
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-5 text-white focus:border-indigo-500 outline-none transition-all font-medium" 
                      />
                    </div>
                  </div>
                  <button disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl active:scale-95 shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Initialize Workspace'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {method === 'google-signin' && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setMethod('selection')} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <h2 className="text-xl font-bold text-white italic">{mode === 'login' ? 'Secure Login' : 'Secure Sign Up'}</h2>
              </div>
              <form onSubmit={handleManualAuth} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-5 pr-12 text-white focus:border-indigo-500 outline-none transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button disabled={isSubmitting} className="w-full bg-white text-black font-black py-4 rounded-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Open Dashboard' : 'Continue')}
                </button>
              </form>
            </div>
          )}

        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-1">
            <Globe size={10} className="text-zinc-600" />
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">Powered by Gemini 3.0</span>
          </div>
          <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
          <div className="flex items-center gap-1">
            <Lock size={10} className="text-zinc-600" />
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-tighter">TLS 1.3 Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
