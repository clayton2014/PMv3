'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/lib/types';
import { getServices } from '@/lib/storage';
import { BarChart3, TrendingUp, DollarSign, Calendar, Download } from 'lucide-react';

export default function Reports() {
  const [services, setServices] = useState<Service[]>([]);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    setServices(getServices());
  }, []);

  const filteredServices = services.filter(service => {
    if (dateRange === 'all') return true;
    
    const serviceDate = new Date(service.date);
    const now = new Date();
    
    switch (dateRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return serviceDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return serviceDate >= monthAgo;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return serviceDate >= yearAgo;
      default:
        return true;
    }
  });

  const totalRevenue = filteredServices.reduce((sum, service) => sum + service.salePrice, 0);
  const totalCost = filteredServices.reduce((sum, service) => sum + service.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Group services by material for chart data
  const materialStats = filteredServices.reduce((acc, service) => {
    const materialName = service.material.name;
    if (!acc[materialName]) {
      acc[materialName] = {
        count: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
      };
    }
    acc[materialName].count++;
    acc[materialName].revenue += service.salePrice;
    acc[materialName].cost += service.totalCost;
    acc[materialName].profit += service.salePrice - service.totalCost;
    return acc;
  }, {} as Record<string, { count: number; revenue: number; cost: number; profit: number }>);

  const exportData = () => {
    const csvContent = [
      ['Serviço', 'Data', 'Material', 'Quantidade (m²)', 'Custo Total', 'Preço de Venda', 'Lucro'],
      ...filteredServices.map(service => [
        service.name,
        service.date,
        service.material.name,
        service.material.quantity.toString(),
        service.totalCost.toFixed(2),
        service.salePrice.toFixed(2),
        (service.salePrice - service.totalCost).toFixed(2),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-impressoes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Relatórios</h2>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all" className="bg-purple-900 text-white">Todos os períodos</option>
            <option value="week" className="bg-purple-900 text-white">Última semana</option>
            <option value="month" className="bg-purple-900 text-white">Último mês</option>
            <option value="year" className="bg-purple-900 text-white">Último ano</option>
          </select>
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500/30 text-white rounded-lg hover:bg-purple-500/40 transition-colors border border-purple-400/50"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Receita Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {totalRevenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Custo Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {totalCost.toFixed(2)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Lucro Total</p>
              <p className="text-2xl font-bold text-white">
                R$ {totalProfit.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Margem de Lucro</p>
              <p className="text-2xl font-bold text-white">
                {profitMargin.toFixed(1)}%
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Material Performance */}
      <div className="backdrop-blur-md bg-gray-800/50 rounded-xl border border-purple-500/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-500/30">
          <h3 className="text-lg font-semibold text-white">Performance por Material</h3>
        </div>
        
        {Object.keys(materialStats).length === 0 ? (
          <div className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">Nenhum dado disponível</p>
            <p className="text-purple-300 text-sm mt-2">
              Adicione serviços para ver os relatórios
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Serviços
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Margem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {Object.entries(materialStats).map(([material, stats]) => (
                  <tr key={material} className="hover:bg-purple-500/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {stats.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      R$ {stats.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      R$ {stats.cost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stats.profit > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        R$ {stats.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        stats.profit > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stats.revenue > 0 ? ((stats.profit / stats.revenue) * 100).toFixed(1) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Services */}
      <div className="backdrop-blur-md bg-gray-800/50 rounded-xl border border-purple-500/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-500/30">
          <h3 className="text-lg font-semibold text-white">Serviços do Período</h3>
        </div>
        
        {filteredServices.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">Nenhum serviço no período</p>
            <p className="text-purple-300 text-sm mt-2">
              Selecione um período diferente ou adicione novos serviços
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-500/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Serviço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Receita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Lucro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {filteredServices.slice(0, 10).map((service) => (
                  <tr key={service.id} className="hover:bg-purple-500/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {service.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {service.material.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      R$ {service.salePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        service.salePrice - service.totalCost > 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        R$ {(service.salePrice - service.totalCost).toFixed(2)}
                      </span>
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