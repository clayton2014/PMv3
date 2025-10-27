'use client';

import { useState, useEffect } from 'react';
import { Service, Material, Ink } from '@/lib/types';
import { saveService, getMaterials, getInks } from '@/lib/storage';
import { Save, Calculator, Package, Droplets, Plus } from 'lucide-react';

export default function ServiceForm() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inks, setInks] = useState<Ink[]>([]);
  const [form, setForm] = useState({
    name: '',
    materialId: '',
    materialQuantity: 0,
    inkId: '',
    inkQuantity: 0,
    salePrice: 0,
    otherCosts: {
      description: '',
      value: 0,
    },
  });
  const [calculatedCost, setCalculatedCost] = useState(0);

  useEffect(() => {
    setMaterials(getMaterials());
    setInks(getInks());
  }, []);

  useEffect(() => {
    calculateCost();
  }, [form.materialId, form.materialQuantity, form.inkId, form.inkQuantity, form.otherCosts.value, materials, inks]);

  const calculateCost = () => {
    let totalCost = 0;

    // Material cost
    if (form.materialId && form.materialQuantity > 0) {
      const material = materials.find(m => m.id === form.materialId);
      if (material && material.costPerSquareMeter) {
        totalCost += material.costPerSquareMeter * form.materialQuantity;
      }
    }

    // Ink cost
    if (form.inkId && form.inkQuantity > 0) {
      const ink = inks.find(i => i.id === form.inkId);
      if (ink && ink.costPerMl) {
        totalCost += ink.costPerMl * form.inkQuantity;
      }
    }

    // Other costs
    if (form.otherCosts.value > 0) {
      totalCost += form.otherCosts.value;
    }

    setCalculatedCost(totalCost);
  };

  const handleNumberInputFocus = (field: string) => {
    if (field === 'materialQuantity' && form.materialQuantity === 0) {
      setForm({ ...form, materialQuantity: 0 });
    } else if (field === 'inkQuantity' && form.inkQuantity === 0) {
      setForm({ ...form, inkQuantity: 0 });
    } else if (field === 'salePrice' && form.salePrice === 0) {
      setForm({ ...form, salePrice: 0 });
    } else if (field === 'otherCostsValue' && form.otherCosts.value === 0) {
      setForm({ ...form, otherCosts: { ...form.otherCosts, value: 0 } });
    }
  };

  const handleNumberInputChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    if (field === 'materialQuantity') {
      setForm({ ...form, materialQuantity: isNaN(numValue) ? 0 : numValue });
    } else if (field === 'inkQuantity') {
      setForm({ ...form, inkQuantity: isNaN(numValue) ? 0 : numValue });
    } else if (field === 'salePrice') {
      setForm({ ...form, salePrice: isNaN(numValue) ? 0 : numValue });
    } else if (field === 'otherCostsValue') {
      setForm({ ...form, otherCosts: { ...form.otherCosts, value: isNaN(numValue) ? 0 : numValue } });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedMaterial = materials.find(m => m.id === form.materialId);
    const selectedInk = inks.find(i => i.id === form.inkId);
    
    if (!selectedMaterial || !selectedInk) {
      alert('Selecione um material e uma tinta');
      return;
    }

    const materialCost = (selectedMaterial.costPerSquareMeter || 0) * form.materialQuantity;
    const inkCost = (selectedInk.costPerMl || 0) * form.inkQuantity;

    const service: Service = {
      id: Date.now().toString(),
      name: form.name,
      material: {
        id: selectedMaterial.id,
        name: selectedMaterial.name,
        quantity: form.materialQuantity,
        cost: materialCost,
      },
      ink: {
        id: selectedInk.id,
        name: selectedInk.name,
        quantity: form.inkQuantity,
        cost: inkCost,
      },
      totalCost: calculatedCost,
      salePrice: form.salePrice,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    saveService(service);
    
    // Reset form
    setForm({
      name: '',
      materialId: '',
      materialQuantity: 0,
      inkId: '',
      inkQuantity: 0,
      salePrice: 0,
      otherCosts: {
        description: '',
        value: 0,
      },
    });

    alert('Serviço salvo com sucesso!');
  };

  const profit = form.salePrice - calculatedCost;
  const profitMargin = form.salePrice > 0 ? (profit / form.salePrice) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Novo Serviço</h2>
        <div className="text-purple-200 text-sm">
          Adicione um novo serviço de impressão
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Name */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Informações do Serviço</h3>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Nome do Serviço
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              placeholder="Ex: Banner 3x2m"
              required
            />
          </div>
        </div>

        {/* Material Selection */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Material</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Tipo de Material
              </label>
              <select
                value={form.materialId}
                onChange={(e) => setForm({ ...form, materialId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="" className="bg-purple-900 text-white">Selecione um material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id} className="bg-purple-900 text-white">
                    {material.name} - R$ {(material.costPerSquareMeter || 0).toFixed(2)}/m²
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Quantidade (m²)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.materialQuantity === 0 ? '' : form.materialQuantity}
                onFocus={() => handleNumberInputFocus('materialQuantity')}
                onChange={(e) => handleNumberInputChange('materialQuantity', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          {form.materialId && form.materialQuantity > 0 && (
            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-purple-200 text-sm">
                Custo do material: <span className="text-white font-medium">
                  R$ {((materials.find(m => m.id === form.materialId)?.costPerSquareMeter || 0) * form.materialQuantity).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Ink Selection */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Droplets className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Tinta</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Tipo de Tinta
              </label>
              <select
                value={form.inkId}
                onChange={(e) => setForm({ ...form, inkId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              >
                <option value="" className="bg-purple-900 text-white">Selecione uma tinta</option>
                {inks.map((ink) => (
                  <option key={ink.id} value={ink.id} className="bg-purple-900 text-white">
                    {ink.name} - R$ {(ink.costPerMl || 0).toFixed(3)}/ml
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Quantidade (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.inkQuantity === 0 ? '' : form.inkQuantity}
                onFocus={() => handleNumberInputFocus('inkQuantity')}
                onChange={(e) => handleNumberInputChange('inkQuantity', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="0.0"
                required
              />
            </div>
          </div>
          {form.inkId && form.inkQuantity > 0 && (
            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-purple-200 text-sm">
                Custo da tinta: <span className="text-white font-medium">
                  R$ {((inks.find(i => i.id === form.inkId)?.costPerMl || 0) * form.inkQuantity).toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Other Costs */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Plus className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Outros Custos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Descrição
              </label>
              <input
                type="text"
                value={form.otherCosts.description}
                onChange={(e) => setForm({ 
                  ...form, 
                  otherCosts: { ...form.otherCosts, description: e.target.value }
                })}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Ex: Acabamento, Entrega, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.otherCosts.value === 0 ? '' : form.otherCosts.value}
                onFocus={() => handleNumberInputFocus('otherCostsValue')}
                onChange={(e) => handleNumberInputChange('otherCostsValue', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
          {form.otherCosts.value > 0 && (
            <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
              <p className="text-purple-200 text-sm">
                {form.otherCosts.description && (
                  <>
                    <span className="text-white font-medium">{form.otherCosts.description}:</span>{' '}
                  </>
                )}
                <span className="text-white font-medium">
                  R$ {form.otherCosts.value.toFixed(2)}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Precificação</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Preço de Venda (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.salePrice === 0 ? '' : form.salePrice}
                onFocus={() => handleNumberInputFocus('salePrice')}
                onChange={(e) => handleNumberInputChange('salePrice', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <span className="text-purple-200 text-sm">Custo Total:</span>
                <span className="text-white font-medium">R$ {calculatedCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <span className="text-purple-200 text-sm">Lucro:</span>
                <span className={`font-medium ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  R$ {profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
                <span className="text-purple-200 text-sm">Margem:</span>
                <span className={`font-medium ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Serviço</span>
          </button>
        </div>
      </form>
    </div>
  );
}