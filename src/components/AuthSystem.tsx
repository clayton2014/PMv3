'use client';

import { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthSystemProps {
  onLogin: (user: User) => void;
}

export default function AuthSystem({ onLogin }: AuthSystemProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.phone) {
        newErrors.phone = 'Telefone é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: User) => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          onLogin(user);
        } else {
          setErrors({ general: 'Email ou senha incorretos' });
        }
      } else {
        // Cadastro
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Verificar se email já existe
        if (users.some((u: User) => u.email === formData.email)) {
          setErrors({ email: 'Este email já está cadastrado' });
          return;
        }

        // Criar novo usuário
        const newUser: User = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Redirecionar para login
        setIsLogin(true);
        setFormData({ name: '', email: '', phone: '', password: '' });
        setErrors({ general: 'Cadastro realizado com sucesso! Faça login para continuar.' });
      }
    } catch (error) {
      setErrors({ general: 'Erro interno. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-gray-800/50 rounded-2xl border border-purple-500/30 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              {isLogin ? <LogIn className="w-8 h-8 text-white" /> : <UserPlus className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h1>
            <p className="text-purple-200">
              {isLogin ? 'Acesse sua conta para continuar' : 'Preencha os dados para se cadastrar'}
            </p>
          </div>

          {/* Mensagem de erro geral */}
          {errors.general && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              errors.general.includes('sucesso') 
                ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                : 'bg-red-500/20 text-red-200 border border-red-500/30'
            }`}>
              {errors.general}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-purple-500/30'
                    }`}
                    placeholder="Digite seu nome completo"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.email ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                  placeholder="Digite seu email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Telefone (apenas no cadastro) */}
            {!isLogin && (
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                      errors.phone ? 'border-red-500' : 'border-purple-500/30'
                    }`}
                    placeholder="Digite seu telefone"
                  />
                </div>
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
            )}

            {/* Senha */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-purple-500/30'
                  }`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Botão de submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          {/* Toggle entre login e cadastro */}
          <div className="mt-6 text-center">
            <p className="text-purple-200">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', phone: '', password: '' });
                  setErrors({});
                }}
                className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}