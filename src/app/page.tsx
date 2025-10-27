'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard from '@/components/Dashboard';
import ServiceForm from '@/components/ServiceForm';
import MaterialsManager from '@/components/MaterialsManager';
import Reports from '@/components/Reports';
import AuthSystem from '@/components/AuthSystem';
import LanguageSelector from '@/components/LanguageSelector';
import { getCurrentUser, signOut } from '@/lib/supabase-storage';
import { BarChart3, Plus, Package, FileText, LogOut, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Garantir que o componente está montado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Verificar se há usuário logado ao carregar a página
  useEffect(() => {
    if (mounted) {
      checkUser();
    }
  }, [mounted]);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Não renderizar nada até estar montado (evita hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {i18n.language === 'en' || i18n.language === 'en-US' ? 'Loading...' : 'Carregando...'}
        </div>
      </div>
    );
  }

  // Se não estiver logado, mostrar tela de autenticação
  if (!currentUser) {
    return <AuthSystem onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart3 },
    { id: 'add-service', label: t('nav.newService'), icon: Plus },
    { id: 'materials', label: t('nav.materials'), icon: Package },
    { id: 'reports', label: t('nav.reports'), icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-gray-800/50 border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25 sm:h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/dc87a6e4-9aa4-45e7-9d82-45e7a1ba49c7.png" 
                alt="Protocolo CMYK Logo" 
                className="w-20 h-20 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white">{t('auth.title')}</h1>
                <p className="text-purple-200 text-sm">{t('auth.subtitle')}</p>
              </div>
            </div>

            {/* User Info, Language Selector & Logout */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSelector />
              
              <div className="flex items-center space-x-2 text-purple-200">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">{t('nav.hello')}, {currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="backdrop-blur-md bg-gray-800/50 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-purple-500/30 text-white border border-purple-400/50 shadow-lg'
                      : 'text-purple-200 hover:bg-purple-500/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="backdrop-blur-md bg-gray-800/50 rounded-2xl border border-purple-500/30 shadow-2xl">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'add-service' && <ServiceForm />}
          {activeTab === 'materials' && <MaterialsManager />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </main>
    </div>
  );
}