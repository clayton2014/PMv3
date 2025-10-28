'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signUp, signIn, getCurrentUser } from '@/lib/supabase-storage';
import { User, Mail, Phone, Lock, Eye, EyeOff, LogIn, UserPlus, Palette } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface AuthSystemProps {
  onLogin: (user: any) => void;
}

type Theme = 'purple' | 'royal-blue' | 'gray';

export default function AuthSystem({ onLogin }: AuthSystemProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<Theme>('purple');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const toggleTheme = () => {
    if (theme === 'purple') {
      setTheme('royal-blue');
    } else if (theme === 'royal-blue') {
      setTheme('gray');
    } else {
      setTheme('purple');
    }
  };

  // Configurações de tema
  const themeConfig = {
    purple: {
      background: 'bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900',
      container: 'backdrop-blur-md bg-gray-800/50 border border-purple-500/30',
      activeTab: 'bg-purple-500 text-white shadow-lg',
      inactiveTab: 'text-purple-200 hover:text-white',
      input: 'bg-gray-700/50 border-purple-500/30 focus:ring-purple-500',
      button: 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      icon: 'text-purple-400',
      text: 'text-purple-200',
      textSecondary: 'text-purple-300',
      link: 'text-purple-400 hover:text-purple-300',
      themeButton: 'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30'
    },
    'royal-blue': {
      background: 'bg-gradient-to-br from-blue-900 via-blue-800 to-royal-blue-900',
      container: 'backdrop-blur-md bg-blue-900/50 border border-blue-400/30',
      activeTab: 'bg-blue-500 text-white shadow-lg',
      inactiveTab: 'text-blue-200 hover:text-white',
      input: 'bg-blue-700/50 border-blue-500/30 focus:ring-blue-500',
      button: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      icon: 'text-blue-400',
      text: 'text-blue-200',
      textSecondary: 'text-blue-300',
      link: 'text-blue-400 hover:text-blue-300',
      themeButton: 'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30'
    },
    gray: {
      background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900',
      container: 'backdrop-blur-md bg-gray-800/50 border border-gray-500/30',
      activeTab: 'bg-gray-500 text-white shadow-lg',
      inactiveTab: 'text-gray-200 hover:text-white',
      input: 'bg-gray-700/50 border-gray-500/30 focus:ring-gray-500',
      button: 'bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700',
      icon: 'text-gray-400',
      text: 'text-gray-200',
      textSecondary: 'text-gray-300',
      link: 'text-gray-400 hover:text-gray-300',
      themeButton: 'bg-gray-500/20 text-gray-200 hover:bg-gray-500/30'
    }
  };

  const currentTheme = themeConfig[theme];

  const getThemeLabel = () => {
    switch (theme) {
      case 'purple': return 'Royal';
      case 'royal-blue': return 'Gray';
      case 'gray': return 'Purple';
      default: return 'Royal';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error);
          return;
        }

        if (data.user) {
          // Buscar dados completos do perfil
          const user = await getCurrentUser();
          
          if (user) {
            onLogin(user);
          } else {
            setError(t('auth.userDataError'));
          }
        }
      } else {
        // Cadastro
        const { data, error } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.phone
        );
        
        if (error) {
          setError(error);
          return;
        }

        // Após cadastro bem-sucedido, redirecionar para login
        setIsLogin(true);
        setFormData({ name: '', email: '', phone: '', password: '' });
        setError('');
        alert(t('auth.registerSuccess'));
      }
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${currentTheme.background} flex items-center justify-center p-4`}>
      {/* Top Controls - Language Selector & Theme Selector */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
        {/* Theme Selector */}
        <button
          onClick={toggleTheme}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentTheme.themeButton} transition-all`}
          title={`Mudar para ${getThemeLabel()}`}
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:block">
            {getThemeLabel()}
          </span>
        </button>

        {/* Language Selector */}
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/75a0d3f2-90f9-4a84-9ab3-e2ba7efae6aa.png" 
              alt="Protocolo CMYK Logo" 
              className="w-40 h-40 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.title')}</h1>
          <p className={currentTheme.text}>{t('auth.subtitle')}</p>
        </div>

        {/* Form Container */}
        <div className={`${currentTheme.container} rounded-2xl shadow-2xl p-8`}>
          {/* Toggle Login/Register */}
          <div className="flex mb-6 bg-gray-700/50 rounded-xl p-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setFormData({ name: '', email: '', phone: '', password: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                isLogin
                  ? currentTheme.activeTab
                  : currentTheme.inactiveTab
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              {t('auth.login')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setFormData({ name: '', email: '', phone: '', password: '' });
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                !isLogin
                  ? currentTheme.activeTab
                  : currentTheme.inactiveTab
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              {t('auth.register')}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className={`block ${currentTheme.text} text-sm font-medium mb-2`}>
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.icon}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className={`w-full pl-10 pr-4 py-3 ${currentTheme.input} rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder={t('auth.enterName')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block ${currentTheme.text} text-sm font-medium mb-2`}>
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.icon}`} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 ${currentTheme.input} rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder={t('auth.enterEmail')}
                />
              </div>
            </div>

            {/* Telefone (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className={`block ${currentTheme.text} text-sm font-medium mb-2`}>
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.icon}`} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 ${currentTheme.input} rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder={t('auth.enterPhone')}
                  />
                </div>
              </div>
            )}

            {/* Senha */}
            <div>
              <label className={`block ${currentTheme.text} text-sm font-medium mb-2`}>
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${currentTheme.icon}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-12 py-3 ${currentTheme.input} rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder={t('auth.enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${currentTheme.icon} hover:text-gray-300 transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 ${currentTheme.button} text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? t('auth.signingIn') : t('auth.signingUp')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      {t('auth.signIn')}
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      {t('auth.signUp')}
                    </>
                  )}
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={`mt-6 text-center ${currentTheme.textSecondary} text-sm`}>
            {isLogin ? (
              <p>
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setFormData({ name: '', email: '', phone: '', password: '' });
                  }}
                  className={`${currentTheme.link} font-medium transition-colors`}
                >
                  {t('auth.registerHere')}
                </button>
              </p>
            ) : (
              <p>
                {t('auth.hasAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setFormData({ name: '', email: '', phone: '', password: '' });
                  }}
                  className={`${currentTheme.link} font-medium transition-colors`}
                >
                  {t('auth.loginHere')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}