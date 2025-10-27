'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/lib/types';
import { getServices, deleteService } from '@/lib/storage';
import { Edit, Trash2, DollarSign, TrendingUp, Package, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteService(id);
      setServices(getServices());
    }
  };

  const totalRevenue = services.reduce((sum, service) => sum + service.salePrice, 0);
  const totalCost = services.reduce((sum, service) => sum + service.totalCost, 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <div className="text-purple-200 text-sm">
          {services.length} serviços registrados
        </div>
      </div>

      {/* Stats Cards */}
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
            <Package className="w-8 h-8 text-red-400" />
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
              <p className="text-purple-200 text-sm font-medium">Margem</p>
              <p className="text-2xl font-bold text-white">
                {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="backdrop-blur-md bg-gray-800/50 rounded-xl border border-purple-500/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-purple-500/30">
          <h3 className="text-lg font-semibold text-white">Serviços Recentes</h3>
        </div>
        
        {services.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-purple-300 mx-auto mb-4" />
            <p className="text-purple-200 text-lg">Nenhum serviço cadastrado</p>
            <p className="text-purple-300 text-sm mt-2">
              Adicione seu primeiro serviço para começar
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
                    Material
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Lucro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/20">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-purple-500/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{service.name}</div>
                      <div className="text-sm text-purple-200">{service.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{service.material.name}</div>
                      <div className="text-sm text-purple-200">{service.material.quantity}m²</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      R$ {service.totalCost.toFixed(2)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-purple-400 hover:text-purple-300 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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