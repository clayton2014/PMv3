'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import ServiceForm from '@/components/ServiceForm';
import MaterialsManager from '@/components/MaterialsManager';
import Reports from '@/components/Reports';
import AuthSystem from '@/components/AuthSystem';
import { BarChart3, Plus, Package, FileText, LogOut, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há usuário logado ao carregar a página
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('dashboard');
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  // Se não estiver logado, mostrar tela de autenticação
  if (!currentUser) {
    return <AuthSystem onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'add-service', label: 'Novo Serviço', icon: Plus },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'reports', label: 'Relatórios', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="backdrop-blur-md bg-gray-800/50 border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PrintManager Pro</h1>
                <p className="text-purple-200 text-sm">Gestão de Impressões</p>
              </div>
            </div>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-purple-200">
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Olá, {currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-200 hover:bg-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sair</span>
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