import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { TrendingUp, Shield, Zap, BarChart3 } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">FinCopilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight">
          Your AI Finance Copilot for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Small Business</span>
        </h1>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl">
          Automate your accounting, predict your cash flow, and get actionable AI-driven insights to grow your business faster.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/register">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full">
              Get Started for Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
              View Demo
            </Button>
          </Link>
        </div>
        
        {/* Abstract dashboard preview */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-slate-200/50 bg-white shadow-2xl p-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10 bottom-0 h-40 mt-auto"></div>
          <div className="flex gap-4 mb-4 opacity-50">
             <div className="h-4 w-4 rounded-full bg-red-400"></div>
             <div className="h-4 w-4 rounded-full bg-yellow-400"></div>
             <div className="h-4 w-4 rounded-full bg-green-400"></div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4">
              <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
            </div>
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4">
              <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
            </div>
            <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 p-4">
              <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div>
              <div className="h-8 w-32 bg-slate-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to manage finances</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-slate-600">Track your revenue, expenses, and profit in real-time with beautiful, easy-to-understand charts.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Predictions</h3>
              <p className="text-slate-600">Our AI analyzes your history to predict cash flow issues before they happen, keeping you safe.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Insights</h3>
              <p className="text-slate-600">Chat with your financial data. Ask questions like "How much did we spend on marketing?" and get instant answers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
