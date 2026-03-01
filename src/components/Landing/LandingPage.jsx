import { useState } from 'react';
import { Briefcase, ArrowRight, CheckCircle, ExternalLink, GraduationCap, Layout, Clock, Globe } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

export default function LandingPage({ onSignIn }) {
  const { t } = useI18n();

  const [scrollY, setScrollY] = useState(0);

  const features = [
    {
      title: "Kanban Job Board",
      description: "Drag and drop your opportunities across customizable stages.",
      icon: <Layout className="w-5 h-5 text-yellow-400" />
    },
    {
      title: "Timeline Analytics",
      description: "Visualize application history through an intuitive Gantt chart.",
      icon: <Clock className="w-5 h-5 text-blue-400" />
    },
    {
      title: "Detailed Job Records",
      description: "Store extensive info: salaries, work type, locations, and notes.",
      icon: <Briefcase className="w-5 h-5 text-green-400" />
    }
  ];

  return (
    <div 
      className="h-screen overflow-y-auto overflow-x-hidden bg-transparent text-white selection:bg-yellow-400 selection:text-black"
      onScroll={(e) => setScrollY(e.currentTarget.scrollTop)}
    >
      {/* Dynamic Backgrounds (Parallax) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-yellow-400/10 blur-[120px] transition-transform duration-700 ease-out" 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] transition-transform duration-700 ease-out"
          style={{ transform: `translateY(-${scrollY * 0.2}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/lwa-logo.png" alt="LWA" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(210,255,0,0.2)]" />
          <span className="text-xl font-bold tracking-tight">Hired<span className="text-yellow-400">With</span>Andi</span>
        </div>
        <button
          onClick={onSignIn}
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:bg-yellow-300 hover:shadow-[0_0_25px_rgba(250,204,21,0.65)] hover:-translate-y-0.5 transition-all"
        >
          {t('signIn') || 'Sign In'}
        </button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-sm font-medium mb-8 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          Next Level Job Tracking
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Land Your Dream Job <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">With Confidence</span>
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-12">
          A comprehensive and visually engaging job application tracking system designed to help you organize, manage, and analyze your career search journey seamlessly.
        </p>

        <button
          onClick={onSignIn}
          className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-lg shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 hover:shadow-yellow-400/40 transition-all hover:-translate-y-1 active:scale-[0.98]"
        >
          Start Tracking Now
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-white/[0.08] bg-neutral-900/40 backdrop-blur-xl hover:bg-neutral-900/60 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why You Need This Section */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-6 mb-24">
        <div className="rounded-3xl bg-neutral-900/60 backdrop-blur-2xl border border-white/10 p-12 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Why You Need This</h2>
          <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto">
            The job search process is chaotic. Spreadsheets get messy, mental notes fall through the cracks, and tracking multiple interviews across different companies quickly becomes overwhelming. 
            <br/><br/>
            HiredWithAndi centralizes the chaos into a clean, actionable dashboard so you never miss a follow-up, forget a salary expectation, or lose momentum on your career journey.
          </p>
        </div>
      </section>

      {/* Partnership & Bootcamp Section */}
      <section className="relative z-10 border-t border-white/[0.08] bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* LearnWithAndi Offer */}
            <div className="p-10 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-transparent backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <Globe className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold">Free with LearnWithAndi Subscriptions</h3>
              </div>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                The HiredWithAndi premium app is bundled entirely for free with all LearnWithAndi subscriptions. Streamline your job search while you learn with us.
              </p>
              <a 
                href="https://learnwithandi.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
              >
                Join LearnWithAndi <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Bootcamp Offer */}
            <div className="p-10 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">For Bootcamps</h3>
              </div>
              <p className="text-neutral-300 mb-8 leading-relaxed">
                Are you running a bootcamp and need a reliable placement tracker for your students? We've got you covered with customized dashboards.
              </p>
              <a 
                href="mailto:contact@learnwithandi.com?subject=Bootcamp%20Demo%20Request" 
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                Contact us for a free demo <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black py-8 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} HiredWithAndi. Part of the <a href="https://learnwithandi.com" className="text-neutral-300 hover:text-white transition-colors">LearnWithAndi</a> Ecosystem.</p>
      </footer>
    </div>
  );
}
