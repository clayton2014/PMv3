'use client';

import { useState, useEffect } from 'react';
import { getMaterials, getInks, saveMaterial, saveInk, deleteMaterial, deleteInk } from '@/lib/supabase-storage';
import { Material, Ink } from '@/lib/types';
import { Plus, Edit2, Trash2, Package, Palette, Save, X } from 'lucide-react';

export default function MaterialsManager() {
  const [activeTab, setActiveTab] = useState<'materials' | 'inks'>('materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inks, setInks] = useState<Ink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingInk, setEditingInk] = useState<Ink | null>(null);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [showInkForm, setShowInkForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleSaveMaterial = async (material: Omit<Material, 'createdAt'>) => {
    try {
      const result = await saveMaterial(material);
      if (result.success) {
        await loadData();
        setEditingMaterial(null);
        setShowMaterialForm(false);
      } else {
        alert('Erro ao salvar material: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar material:', error);
      alert('Erro ao salvar material');
    }
  };

  const handleSaveInk = async (ink: Omit<Ink, 'createdAt'>) => {
    try {
      const result = await saveInk(ink);
      if (result.success) {
        await loadData();
        setEditingInk(null);
        setShowInkForm(false);
      } else {
        alert('Erro ao salvar tinta: ' + result.error);
      }
    } catch (error) {
      console.error('Erro ao salvar tinta:', error);
      alert('Erro ao salvar tinta');
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      try {
        const result = await deleteMaterial(id);
        if (result.success) {
          await loadData();
        } else {
          alert('Erro ao excluir material: ' + result.error);
        }
      } catch (error) {
        console.error('Erro ao excluir material:', error);
        alert('Erro ao excluir material');
      }
    }
  };

  const handleDeleteInk = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tinta?')) {
      try {
        const result = await deleteInk(id);
        if (result.success) {
          await loadData();
        } else {
          alert('Erro ao excluir tinta: ' + result.error);
        }
      } catch (error) {
        console.error('Erro ao excluir tinta:', error);
        alert('Erro ao excluir tinta');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Gerenciar Materiais e Tintas</h2>
          <p className="text-purple-200">Configure seus materiais e tintas padrão</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-700/50 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'materials'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-purple-200 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Materiais</span>
        </button>
        <button
          onClick={() => setActiveTab('inks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'inks'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'text-purple-200 hover:text-white'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Tintas</span>
        </button>
      </div>

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Materiais</h3>
            <button
              onClick={() => setShowMaterialForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Material</span>
            </button>
          </div>

          <div className="grid gap-4">
            {materials.map((material) => (
              <div key={material.id} className="bg-gray-700/50 rounded-xl p-6 border border-purple-500/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{material.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-purple-300">Tipo:</span>
                        <p className="text-white capitalize">{material.type}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Custo/m²:</span>
                        <p className="text-white">R$ {(material.costPerSquareMeter || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Fornecedor:</span>
                        <p className="text-white">{material.supplier}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Descrição:</span>
                        <p className="text-white">{material.description || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingMaterial(material)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inks Tab */}
      {activeTab === 'inks' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Tintas</h3>
            <button
              onClick={() => setShowInkForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Tinta</span>
            </button>
          </div>

          <div className="grid gap-4">
            {inks.map((ink) => (
              <div key={ink.id} className="bg-gray-700/50 rounded-xl p-6 border border-purple-500/30">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{ink.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-purple-300">Cor:</span>
                        <p className="text-white">{ink.color}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Custo/ml:</span>
                        <p className="text-white">R$ {ink.costPerMl.toFixed(4)}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Fornecedor:</span>
                        <p className="text-white">{ink.supplier}</p>
                      </div>
                      <div>
                        <span className="text-purple-300">Descrição:</span>
                        <p className="text-white">{ink.description || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingInk(ink)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInk(ink.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Material Form Modal */}
      {(showMaterialForm || editingMaterial) && (
        <MaterialForm
          material={editingMaterial}
          onSave={handleSaveMaterial}
          onCancel={() => {
            setEditingMaterial(null);
            setShowMaterialForm(false);
          }}
        />
      )}

      {/* Ink Form Modal */}
      {(showInkForm || editingInk) && (
        <InkForm
          ink={editingInk}
          onSave={handleSaveInk}
          onCancel={() => {
            setEditingInk(null);
            setShowInkForm(false);
          }}
        />
      )}
    </div>
  );
}

// Material Form Component
function MaterialForm({ 
  material, 
  onSave, 
  onCancel 
}: { 
  material: Material | null; 
  onSave: (material: Omit<Material, 'createdAt'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    id: material?.id || '',
    name: material?.name || '',
    type: material?.type || 'lona' as Material['type'],
    costPerMeter: material?.costPerMeter || 0,
    costPerSquareMeter: material?.costPerSquareMeter || 0,
    supplier: material?.supplier || '',
    description: material?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-purple-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">
          {material ? 'Editar Material' : 'Novo Material'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Tipo</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Material['type'] })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="lona">Lona</option>
              <option value="adesivo">Adesivo</option>
              <option value="papel">Papel</option>
              <option value="vinil">Vinil</option>
              <option value="tecido">Tecido</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Custo por m²</label>
            <input
              type="number"
              step="0.01"
              value={formData.costPerSquareMeter}
              onChange={(e) => setFormData({ ...formData, costPerSquareMeter: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Fornecedor</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Ink Form Component
function InkForm({ 
  ink, 
  onSave, 
  onCancel 
}: { 
  ink: Ink | null; 
  onSave: (ink: Omit<Ink, 'createdAt'>) => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    id: ink?.id || '',
    name: ink?.name || '',
    color: ink?.color || '',
    costPerMl: ink?.costPerMl || 0,
    supplier: ink?.supplier || '',
    description: ink?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-purple-500/30">
        <h3 className="text-xl font-semibold text-white mb-4">
          {ink ? 'Editar Tinta' : 'Nova Tinta'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Cor</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Custo por ml</label>
            <input
              type="number"
              step="0.0001"
              value={formData.costPerMl}
              onChange={(e) => setFormData({ ...formData, costPerMl: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Fornecedor</label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}