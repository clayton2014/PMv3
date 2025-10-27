'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getServices } from '@/lib/supabase-storage';
import { Service } from '@/lib/types';
import { FileText, Download, Calendar, Filter, TrendingUp, DollarSign } from 'lucide-react';

export default function Reports() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
    let filtered = [...services];
    
    if (dateFilter === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end date
      
      filtered = filtered.filter(service => {
        const serviceDate = new Date(service.date);
        return serviceDate >= start && serviceDate <= end;
      });
    } else if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(service => new Date(service.date) >= filterDate);
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredServices = getFilteredServices();

  const generateReport = () => {
    const totalServices = filteredServices.length;
    const totalRevenue = filteredServices.reduce((sum, service) => sum + service.salePrice, 0);
    const totalCosts = filteredServices.reduce((sum, service) => sum + service.totalCost, 0);
    const totalProfit = filteredServices.reduce((sum, service) => sum + service.profit, 0);
    const averageMargin = totalServices > 0 
      ? filteredServices.reduce((sum, service) => sum + service.margin, 0) / totalServices 
      : 0;

    // Group by material
    const materialStats = filteredServices.reduce((acc, service) => {
      const materialName = service.material.name;
      if (!acc[materialName]) {
        acc[materialName] = { count: 0, revenue: 0, quantity: 0 };
      }
      acc[materialName].count++;
      acc[materialName].revenue += service.salePrice;
      acc[materialName].quantity += service.material.quantity;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; quantity: number }>);

    // Group by ink
    const inkStats = filteredServices.reduce((acc, service) => {
      const inkName = service.ink.name;
      if (!acc[inkName]) {
        acc[inkName] = { count: 0, revenue: 0, quantity: 0 };
      }
      acc[inkName].count++;
      acc[inkName].revenue += service.salePrice;
      acc[inkName].quantity += service.ink.quantity;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; quantity: number }>);

    return {
      totalServices,
      totalRevenue,
      totalCosts,
      totalProfit,
      averageMargin,
      materialStats,
      inkStats
    };
  };

  const exportToCSV = () => {
    const headers = [
      'Data',
      'Serviço',
      'Material',
      'Qtd Material (m²)',
      'Tinta',
      'Qtd Tinta (ml)',
      'Custo Total',
      'Preço Venda',
      'Lucro',
      'Margem (%)'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredServices.map(service => [
        new Date(service.date).toLocaleDateString('pt-BR'),
        `"${service.name}"`,
        `"${service.material.name}"`,
        service.material.quantity,
        `"${service.ink.name}"`,
        service.ink.quantity,
        service.totalCost.toFixed(2),
        service.salePrice.toFixed(2),
        service.profit.toFixed(2),
        service.margin.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-servicos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const report = generateReport();

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
          <h2 className="text-3xl font-bold text-white mb-2">{t('reports.title')}</h2>
          <p className="text-purple-200">{t('reports.subtitle')}</p>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t('reports.export')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">{t('reports.period')}</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos os períodos</option>
              <option value="week">Última semana</option>
              <option value="month">{t('reports.lastMonth')}</option>
              <option value="quarter">{t('reports.last3Months')}</option>
              <option value="year">{t('reports.thisYear')}</option>
              <option value="custom">Período personalizado</option>
            </select>
          </div>
          
          {dateFilter === 'custom' && (
            <>
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Data Inicial</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm font-medium mb-2">Data Final</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{report.totalServices}</div>
          <div className="text-blue-300 text-sm">Total de Serviços</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$ {report.totalRevenue.toFixed(2)}</div>
          <div className="text-green-300 text-sm">{t('reports.totalRevenue')}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$ {report.totalProfit.toFixed(2)}</div>
          <div className="text-purple-300 text-sm">{t('reports.totalProfit')}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{report.averageMargin.toFixed(1)}%</div>
          <div className="text-orange-300 text-sm">{t('reports.averageMargin')}</div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Materials Stats */}
        <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">{t('reports.topMaterials')}</h3>
          <div className="space-y-3">
            {Object.entries(report.materialStats)
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 5)
              .map(([material, stats]) => (
                <div key={material} className="flex justify-between items-center py-2 border-b border-purple-500/20">
                  <div>
                    <div className="text-white font-medium">{material}</div>
                    <div className="text-purple-300 text-sm">{stats.quantity.toFixed(2)}m² total</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{stats.count} serviços</div>
                    <div className="text-green-400 text-sm">$ {stats.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Inks Stats */}
        <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Tintas Mais Utilizadas</h3>
          <div className="space-y-3">
            {Object.entries(report.inkStats)
              .sort(([,a], [,b]) => b.count - a.count)
              .slice(0, 5)
              .map(([ink, stats]) => (
                <div key={ink} className="flex justify-between items-center py-2 border-b border-purple-500/20">
                  <div>
                    <div className="text-white font-medium">{ink}</div>
                    <div className="text-purple-300 text-sm">{stats.quantity.toFixed(2)}ml total</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{stats.count} serviços</div>
                    <div className="text-green-400 text-sm">$ {stats.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4">Lista de Serviços</h3>
        
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <p className="text-purple-200 text-lg mb-2">Nenhum serviço encontrado</p>
            <p className="text-purple-300 text-sm">Ajuste os filtros ou crie novos serviços</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">Data</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">Serviço</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">Material</th>
                  <th className="text-left py-3 px-4 text-purple-200 font-medium">Tinta</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">Custo</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">Venda</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">Lucro</th>
                  <th className="text-right py-3 px-4 text-purple-200 font-medium">Margem</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="border-b border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                    <td className="py-3 px-4 text-purple-200 text-sm">
                      {new Date(service.date).toLocaleDateString('pt-BR')}
                    </td>
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