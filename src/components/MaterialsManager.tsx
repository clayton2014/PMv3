'use client';

import { useState, useEffect } from 'react';
import { Material, Ink } from '@/lib/types';
import { getMaterials, getInks, saveMaterial, saveInk, deleteMaterial, deleteInk } from '@/lib/storage';
import { Package, Droplets, Edit, Trash2, Plus, Save, X } from 'lucide-react';

export default function MaterialsManager() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [inks, setInks] = useState<Ink[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingInk, setEditingInk] = useState<Ink | null>(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddInk, setShowAddInk] = useState(false);

  useEffect(() => {
    setMaterials(getMaterials());
    setInks(getInks());
  }, []);

  const handleSaveMaterial = (material: Material) => {
    saveMaterial(material);
    setMaterials(getMaterials());
    setEditingMaterial(null);
    setShowAddMaterial(false);
  };

  const handleSaveInk = (ink: Ink) => {
    saveInk(ink);
    setInks(getInks());
    setEditingInk(null);
    setShowAddInk(false);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este material?')) {
      deleteMaterial(id);
      setMaterials(getMaterials());
    }
  };

  const handleDeleteInk = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tinta?')) {
      deleteInk(id);
      setInks(getInks());
    }
  };

  const MaterialForm = ({ material, onSave, onCancel }: {
    material?: Material;
    onSave: (material: Material) => void;
    onCancel: () => void;
  }) => {
    const [form, setForm] = useState({
      id: material?.id || Date.now().toString(),
      name: material?.name || '',
      type: material?.type || 'lona' as const,
      costPerSquareMeter: material?.costPerSquareMeter || 0,
      supplier: material?.supplier || 'Fornecedor Padrão',
      description: material?.description || '',
      createdAt: material?.createdAt || new Date().toISOString()
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        ...form,
        costPerMeter: form.costPerSquareMeter
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Material['type'] })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="lona">Lona</option>
              <option value="adesivo">Adesivo</option>
              <option value="tecido">Tecido</option>
              <option value="papel">Papel</option>
              <option value="vinil">Vinil</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Custo por m² (R$)</label>
            <input
              type="number"
              step="0.01"
              value={form.costPerSquareMeter}
              onChange={(e) => setForm({ ...form, costPerSquareMeter: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Fornecedor</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </form>
    );
  };

  const InkForm = ({ ink, onSave, onCancel }: {
    ink?: Ink;
    onSave: (ink: Ink) => void;
    onCancel: () => void;
  }) => {
    const [form, setForm] = useState({
      id: ink?.id || Date.now().toString(),
      name: ink?.name || '',
      color: ink?.color || '',
      costPerMl: ink?.costPerMl || 0,
      supplier: ink?.supplier || 'JetBest',
      description: ink?.description || '',
      createdAt: ink?.createdAt || new Date().toISOString()
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(form);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-purple-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Nome</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Cor</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Custo por ml (R$)</label>
            <input
              type="number"
              step="0.001"
              value={form.costPerMl}
              onChange={(e) => setForm({ ...form, costPerMl: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Fornecedor</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Cancelar</span>
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Salvar</span>
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gerenciar Materiais e Tintas</h2>
        <div className="text-purple-200 text-sm">
          Configure os materiais e tintas padrão
        </div>
      </div>

      {/* Materials Section */}
      <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Package className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Materiais</h3>
          </div>
          <button
            onClick={() => setShowAddMaterial(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Material</span>
          </button>
        </div>

        {showAddMaterial && (
          <div className="mb-6">
            <MaterialForm
              onSave={handleSaveMaterial}
              onCancel={() => setShowAddMaterial(false)}
            />
          </div>
        )}

        <div className="space-y-4">
          {materials.map((material) => (
            <div key={material.id} className="p-4 bg-gray-700/50 rounded-lg border border-purple-500/20">
              {editingMaterial?.id === material.id ? (
                <MaterialForm
                  material={editingMaterial}
                  onSave={handleSaveMaterial}
                  onCancel={() => setEditingMaterial(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h4 className="text-lg font-medium text-white">{material.name}</h4>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-sm">
                        {material.type}
                      </span>
                      <span className="text-green-400 font-medium">
                        R$ {(material.costPerSquareMeter || 0).toFixed(2)}/m²
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm mt-1">{material.description}</p>
                    <p className="text-purple-300 text-xs mt-1">Fornecedor: {material.supplier}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingMaterial(material)}
                      className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inks Section */}
      <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Droplets className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">Tintas</h3>
          </div>
          <button
            onClick={() => setShowAddInk(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Tinta</span>
          </button>
        </div>

        {showAddInk && (
          <div className="mb-6">
            <InkForm
              onSave={handleSaveInk}
              onCancel={() => setShowAddInk(false)}
            />
          </div>
        )}

        <div className="space-y-4">
          {inks.map((ink) => (
            <div key={ink.id} className="p-4 bg-gray-700/50 rounded-lg border border-purple-500/20">
              {editingInk?.id === ink.id ? (
                <InkForm
                  ink={editingInk}
                  onSave={handleSaveInk}
                  onCancel={() => setEditingInk(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h4 className="text-lg font-medium text-white">{ink.name}</h4>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-200 rounded text-sm">
                        {ink.color}
                      </span>
                      <span className="text-green-400 font-medium">
                        R$ {ink.costPerMl.toFixed(3)}/ml
                      </span>
                    </div>
                    <p className="text-purple-200 text-sm mt-1">{ink.description}</p>
                    <p className="text-purple-300 text-xs mt-1">Fornecedor: {ink.supplier}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingInk(ink)}
                      className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInk(ink.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}