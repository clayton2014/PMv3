'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/lib/supabase-storage';
import { Service } from '@/lib/types';
import { BarChart3, TrendingUp, DollarSign, Package, Calendar, Filter } from 'lucide-react';

export default function Dashboard() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'week', 'month'

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredServices = () => {
    if (filter === 'all') return services;
    
    const now = new Date();
    const filterDate = new Date();
    
    if (filter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return services.filter(service => new Date(service.date) >= filterDate);
  };

  const filteredServices = getFilteredServices();

  const stats = {
    totalServices: filteredServices.length,
    totalRevenue: filteredServices.reduce((sum, service) => sum + service.salePrice, 0),
    totalProfit: filteredServices.reduce((sum, service) => sum + service.profit, 0),
    averageMargin: filteredServices.length > 0 
      ? filteredServices.reduce((sum, service) => sum + service.margin, 0) / filteredServices.length 
      : 0
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-white text-xl">{t('dashboard.loading')}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('dashboard.title')}</h2>
          <p className="text-purple-200">{t('dashboard.subtitle')}</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-purple-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">{t('dashboard.allPeriods')}</option>
            <option value="week">{t('dashboard.lastWeek')}</option>
            <option value="month">{t('dashboard.lastMonth')}</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Package className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-blue-300 text-sm font-medium">{t('dashboard.services')}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalServices}</div>
          <div className="text-blue-300 text-sm">{t('dashboard.totalServices')}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-green-300 text-sm font-medium">{t('dashboard.revenue')}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$ {stats.totalRevenue.toFixed(2)}</div>
          <div className="text-green-300 text-sm">{t('dashboard.totalSales')}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-purple-300 text-sm font-medium">{t('dashboard.profit')}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$ {stats.totalProfit.toFixed(2)}</div>
          <div className="text-purple-300 text-sm">{t('dashboard.totalProfit')}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-orange-300 text-sm font-medium">{t('dashboard.margin')}</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.averageMargin.toFixed(1)}%</div>
          <div className="text-orange-300 text-sm">{t('dashboard.averageMargin')}</div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>{t('dashboard.recentServices')}</span>
          </h3>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-2">{t('dashboard.noServices')}</p>
            <p className="text-purple-300 text-sm">{t('dashboard.createFirst')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">{t('dashboard.service')}</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">{t('dashboard.material')}</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">{t('dashboard.ink')}</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">{t('dashboard.cost')}</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">{t('dashboard.sale')}</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">{t('dashboard.profit')}</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">{t('dashboard.margin')}</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">{t('dashboard.date')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.slice(0, 10).map((service) => (
                  <tr key={service.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{service.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-purple-200 text-sm">
                        {service.material.name}
                        <div className="text-purple-300 text-xs">{service.material.quantity}m²</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-purple-200 text-sm">
                        {service.ink.name}
                        <div className="text-purple-300 text-xs">{service.ink.quantity}ml</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      $ {service.totalCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      $ {service.salePrice.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      service.profit >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      $ {service.profit.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      service.margin >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {service.margin.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-right text-purple-200 text-sm">
                      {new Date(service.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}