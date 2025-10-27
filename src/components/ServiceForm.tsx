'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMaterials, getInks, saveService } from '@/lib/supabase-storage';
import { Material, Ink, ServiceFormData } from '@/lib/types';
import { Calculator, Plus, Trash2, Save } from 'lucide-react';

export default function ServiceForm() {
  const { t, i18n } = useTranslation();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inks, setInks] = useState<Ink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    material: '',
    materialQuantity: 0,
    ink: '',
    inkQuantity: 0,
    salePrice: 0,
    otherCosts: []
  });

  const [calculations, setCalculations] = useState({
    materialCost: 0,
    inkCost: 0,
    otherCostsTotal: 0,
    totalCost: 0,
    profit: 0,
    margin: 0
  });

  // Função para formatar moeda sempre em dólar
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Função para obter símbolo da moeda sempre em dólar
  const getCurrencySymbol = () => {
    return '$';
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateCosts();
  }, [formData, materials, inks]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsData, inksData] = await Promise.all([
        getMaterials(),
        getInks()
      ]);
      setMaterials(materialsData);
      setInks(inksData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCosts = () => {
    const selectedMaterial = materials.find(m => m.id === formData.material);
    const selectedInk = inks.find(i => i.id === formData.ink);
    
    const materialCost = selectedMaterial 
      ? (selectedMaterial.costPerSquareMeter || 0) * formData.materialQuantity 
      : 0;
    
    const inkCost = selectedInk 
      ? selectedInk.costPerMl * formData.inkQuantity 
      : 0;

    const otherCostsTotal = (formData.otherCosts || []).reduce((sum, cost) => sum + (cost.value || 0), 0);
    
    const totalCost = materialCost + inkCost + otherCostsTotal;
    const profit = formData.salePrice - totalCost;
    const margin = formData.salePrice > 0 ? (profit / formData.salePrice) * 100 : 0;

    setCalculations({
      materialCost,
      inkCost,
      otherCostsTotal,
      totalCost,
      profit,
      margin
    });
  };

  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuantityFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.select();
    }
  };

  const addOtherCost = () => {
    const newOtherCosts = [...(formData.otherCosts || []), { description: '', value: 0 }];
    handleInputChange('otherCosts', newOtherCosts);
  };

  const updateOtherCost = (index: number, field: 'description' | 'value', value: string | number) => {
    const newOtherCosts = [...(formData.otherCosts || [])];
    newOtherCosts[index] = { ...newOtherCosts[index], [field]: value };
    handleInputChange('otherCosts', newOtherCosts);
  };

  const removeOtherCost = (index: number) => {
    const newOtherCosts = (formData.otherCosts || []).filter((_, i) => i !== index);
    handleInputChange('otherCosts', newOtherCosts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.material || !formData.ink) {
      alert(t('service.fillRequired'));
      return;
    }

    setSaving(true);
    
    try {
      const selectedMaterial = materials.find(m => m.id === formData.material);
      const selectedInk = inks.find(i => i.id === formData.ink);

      const service = {
        name: formData.name,
        material: {
          id: formData.material,
          name: selectedMaterial?.name || '',
          quantity: formData.materialQuantity,
          cost: calculations.materialCost
        },
        ink: {
          id: formData.ink,
          name: selectedInk?.name || '',
          quantity: formData.inkQuantity,
          cost: calculations.inkCost
        },
        otherCosts: formData.otherCosts || [],
        totalCost: calculations.totalCost,
        salePrice: formData.salePrice,
        profit: calculations.profit,
        margin: calculations.margin
      };

      const result = await saveService(service);
      
      if (result.success) {
        alert(t('service.success'));
        // Reset form
        setFormData({
          name: '',
          material: '',
          materialQuantity: 0,
          ink: '',
          inkQuantity: 0,
          salePrice: 0,
          otherCosts: []
        });
      } else {
        alert(t('service.error') + ': ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      alert(t('service.error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-white text-xl">{t('dashboard.loading')}</div>
      </div>
    );
  }

  return (
    <div className="p-8" key={i18n.language}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{t('service.title')}</h2>
          <p className="text-purple-200">{t('service.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Nome do Serviço */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('service.serviceName')} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={t('service.serviceNamePlaceholder')}
                required
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('dashboard.material')} *
              </label>
              <select
                value={formData.material}
                onChange={(e) => handleInputChange('material', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">{t('service.selectMaterial')}</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} - {formatCurrency(material.costPerSquareMeter || 0)}/m²
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade de Material */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('service.quantity')} (m²) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.materialQuantity}
                onChange={(e) => handleInputChange('materialQuantity', parseFloat(e.target.value) || 0)}
                onFocus={handleQuantityFocus}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
                required
              />
            </div>

            {/* Tinta */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('dashboard.ink')} *
              </label>
              <select
                value={formData.ink}
                onChange={(e) => handleInputChange('ink', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">{t('service.selectInk')}</option>
                {inks.map((ink) => (
                  <option key={ink.id} value={ink.id}>
                    {ink.name} - {formatCurrency(ink.costPerMl)}/ml
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade de Tinta */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('service.quantity')} (ml) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.inkQuantity}
                onChange={(e) => handleInputChange('inkQuantity', parseFloat(e.target.value) || 0)}
                onFocus={handleQuantityFocus}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0"
                required
              />
            </div>

            {/* Outros Custos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-purple-200 text-sm font-medium">
                  {t('service.otherCosts')}
                </label>
                <button
                  type="button"
                  onClick={addOtherCost}
                  className="flex items-center space-x-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('service.add')}</span>
                </button>
              </div>
              
              {(formData.otherCosts || []).map((cost, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={cost.description}
                    onChange={(e) => updateOtherCost(index, 'description', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder={t('service.description')}
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={cost.value}
                    onChange={(e) => updateOtherCost(index, 'value', parseFloat(e.target.value) || 0)}
                    className="w-24 px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    placeholder="0,00"
                  />
                  <button
                    type="button"
                    onClick={() => removeOtherCost(index)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Preço de Venda */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">
                {t('service.salePrice')} ({getCurrencySymbol()}) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                onFocus={handleQuantityFocus}
                className="w-full px-4 py-3 bg-gray-700/50 border border-purple-500/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Right Column - Calculations */}
          <div className="bg-gray-700/30 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">{t('service.calculations')}</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-purple-200">{t('service.materialCost')}:</span>
                <span className="text-white font-medium">{formatCurrency(calculations.materialCost)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                <span className="text-purple-200">{t('service.inkCost')}:</span>
                <span className="text-white font-medium">{formatCurrency(calculations.inkCost)}</span>
              </div>

              {calculations.otherCostsTotal > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-purple-500/20">
                  <span className="text-purple-200">{t('service.otherCosts')}:</span>
                  <span className="text-white font-medium">{formatCurrency(calculations.otherCostsTotal)}</span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-purple-500/20 text-lg">
                <span className="text-purple-200 font-medium">{t('service.totalCost')}:</span>
                <span className="text-white font-bold">{formatCurrency(calculations.totalCost)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-purple-500/20 text-lg">
                <span className="text-purple-200 font-medium">{t('service.salePrice')}:</span>
                <span className="text-white font-bold">{formatCurrency(formData.salePrice)}</span>
              </div>

              <div className={`flex justify-between items-center py-2 border-b border-purple-500/20 text-lg ${
                calculations.profit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <span className="font-medium">{t('service.profit')}:</span>
                <span className="font-bold">{formatCurrency(calculations.profit)}</span>
              </div>

              <div className={`flex justify-between items-center py-2 text-xl ${
                calculations.margin >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <span className="font-medium">{t('service.margin')}:</span>
                <span className="font-bold">{calculations.margin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('service.saving')}</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{t('service.save')}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}