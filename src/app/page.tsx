'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dashboard from '@/components/Dashboard';
import ServiceForm from '@/components/ServiceForm';
import MaterialsManager from '@/components/MaterialsManager';
import Reports from '@/components/Reports';
import AuthSystem from '@/components/AuthSystem';
import LanguageSelector from '@/components/LanguageSelector';
import { getCurrentUser, signOut, saveUserLayoutPreference, saveLayoutToCache, Theme } from '@/lib/supabase-storage';
import { BarChart3, Plus, Package, FileText, LogOut, User, Palette } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  layoutPreference?: string;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('purple');

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
      if (user) {
        setCurrentUser(user);
        // Carregar preferência de layout do usuário
        if (user.layoutPreference) {
          setTheme(user.layoutPreference as Theme);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Carregar preferência de layout do usuário
    if (user.layoutPreference) {
      setTheme(user.layoutPreference as Theme);
    }
  };

  const handleLogout = async () => {
    try {
      // Salvar o layout atual no cache local antes de fazer logout
      saveLayoutToCache(theme);
      
      await signOut();
      setCurrentUser(null);
      setActiveTab('dashboard');
      // Não resetar o tema - ele será mantido pelo cache local na tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const toggleTheme = async () => {
    let newTheme: Theme;
    
    if (theme === 'purple') {
      newTheme = 'royal-blue';
    } else if (theme === 'royal-blue') {
      newTheme = 'gray';
    } else if (theme === 'gray') {
      newTheme = 'yellow';
    } else {
      newTheme = 'purple';
    }
    
    setTheme(newTheme);
    
    // Salvar no cache local imediatamente
    saveLayoutToCache(newTheme);
    
    // Salvar preferência no banco de dados se usuário estiver logado
    if (currentUser) {
      try {
        await saveUserLayoutPreference(currentUser.id, newTheme);
      } catch (error) {
        console.error('Erro ao salvar preferência de layout:', error);
      }
    }
  };

  // Configurações de tema
  const themeConfig = {
    purple: {
      background: 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900',
      header: 'backdrop-blur-md bg-gray-800/50 border-b border-purple-500/30',
      nav: 'backdrop-blur-md bg-gray-800/50 border-b border-purple-500/30',
      main: 'backdrop-blur-md bg-gray-800/50 rounded-2xl border border-purple-500/30 shadow-2xl',
      activeTab: 'bg-purple-500/30 text-white border border-purple-400/50 shadow-lg',
      inactiveTab: 'text-purple-200 hover:bg-purple-500/20 hover:text-white',
      subtitle: 'text-purple-200',
      userInfo: 'text-purple-200'
    },
    'royal-blue': {
      background: 'bg-gradient-to-br from-blue-900 via-blue-800 to-royal-blue-900',
      header: 'backdrop-blur-md bg-blue-900/50 border-b border-blue-400/30',
      nav: 'backdrop-blur-md bg-blue-900/50 border-b border-blue-400/30',
      main: 'backdrop-blur-md bg-blue-900/50 rounded-2xl border border-blue-400/30 shadow-2xl',
      activeTab: 'bg-blue-500/30 text-white border border-blue-400/50 shadow-lg',
      inactiveTab: 'text-blue-200 hover:bg-blue-500/20 hover:text-white',
      subtitle: 'text-blue-200',
      userInfo: 'text-blue-200'
    },
    gray: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900',
      header: 'backdrop-blur-md bg-gray-800/50 border-b border-gray-500/30',
      nav: 'backdrop-blur-md bg-gray-800/50 border-b border-gray-500/30',
      main: 'backdrop-blur-md bg-gray-800/50 rounded-2xl border border-gray-500/30 shadow-2xl',
      activeTab: 'bg-gray-500/30 text-white border border-gray-400/50 shadow-lg',
      inactiveTab: 'text-gray-200 hover:bg-gray-500/20 hover:text-white',
      subtitle: 'text-gray-200',
      userInfo: 'text-gray-200'
    },
    yellow: {
      background: 'bg-gradient-to-br from-yellow-600 via-orange-600 to-amber-700',
      header: 'backdrop-blur-md bg-yellow-900/50 border-b border-yellow-500/30',
      nav: 'backdrop-blur-md bg-yellow-900/50 border-b border-yellow-500/30',
      main: 'backdrop-blur-md bg-yellow-900/50 rounded-2xl border border-yellow-500/30 shadow-2xl',
      activeTab: 'bg-yellow-500/30 text-black border border-yellow-400/50 shadow-lg',
      inactiveTab: 'text-yellow-200 hover:bg-yellow-500/20 hover:text-white',
      subtitle: 'text-yellow-200',
      userInfo: 'text-yellow-200'
    }
  };

  const currentTheme = themeConfig[theme];

  // Não renderizar nada até estar montado (evita hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center`}>
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

  const getThemeLabel = () => {
    switch (theme) {
      case 'purple': return 'Cyan';
      case 'royal-blue': return 'Black';
      case 'gray': return 'Yellow';
      case 'yellow': return 'Magenta';
      default: return 'Cyan';
    }
  };

  const getThemeButtonStyle = () => {
    switch (theme) {
      case 'purple': return 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30';
      case 'royal-blue': return 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30';
      case 'gray': return 'bg-gray-500/20 text-gray-200 hover:bg-gray-500/30';
      case 'yellow': return 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30';
      default: return 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30';
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Header */}
      <header className={currentTheme.header + ' sticky top-0 z-50'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-25 sm:h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/dc87a6e4-9aa4-45e7-9d82-45e7a1ba49c7.png" 
                alt="Protocolo CMYK Logo" 
                className="w-20 h-20 object-contain"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">{t('auth.title')}</h1>
                <p className={`${currentTheme.subtitle} text-sm`}>{t('auth.subtitle')}</p>
              </div>
            </div>

            {/* Theme Selector, User Info, Language Selector & Logout */}
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <button
                onClick={toggleTheme}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getThemeButtonStyle()} transition-all`}
                title={`Mudar para ${getThemeLabel()}`}
              >
                <Palette className="w-4 h-4" />
                <span>
                  {getThemeLabel()}
                </span>
              </button>

              {/* Language Selector */}
              <LanguageSelector />
              
              <div className={`flex items-center space-x-2 ${currentTheme.userInfo}`}>
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
      <nav className={currentTheme.nav}>
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
                      ? currentTheme.activeTab
                      : currentTheme.inactiveTab
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
        <div className={currentTheme.main}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'add-service' && <ServiceForm />}
          {activeTab === 'materials' && <MaterialsManager />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </main>
    </div>
  );
}