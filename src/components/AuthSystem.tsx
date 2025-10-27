'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signUp, signIn, getCurrentUser } from '@/lib/supabase-storage';
import { User, Mail, Phone, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface AuthSystemProps {
  onLogin: (user: any) => void;
}

export default function AuthSystem({ onLogin }: AuthSystemProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
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
          <p className="text-purple-200">{t('auth.subtitle')}</p>
        </div>

        {/* Form Container */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-2xl border border-purple-500/30 shadow-2xl p-8">
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
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
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
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white'
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
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  {t('auth.name')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={t('auth.enterName')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder={t('auth.enterEmail')}
                />
              </div>
            </div>

            {/* Telefone (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  {t('auth.phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder={t('auth.enterPhone')}
                  />
                </div>
              </div>
            )}

            {/* Senha */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder={t('auth.enterPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-6 text-center text-purple-300 text-sm">
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
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
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
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
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