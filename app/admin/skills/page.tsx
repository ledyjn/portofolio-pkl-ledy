'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, LogOut, Code2, Palette, Globe, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

const iconMap: { [key: string]: any } = {
  'code': Code2,
  'database': Code2,
  'design': Palette,
  'web': Globe,
};

export default function SkillsAdmin() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 50,
    icon: 'code',
    url: ''
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/admin/login');
      return;
    }
    await fetchSkills();
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      alert('Error loading skills. Pastikan table skills sudah dibuat di Supabase!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update({
            name: formData.name,
            category: formData.category,
            level: formData.level,
            icon: formData.icon,
            url: formData.url || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSkill.id);

        if (error) throw error;
        alert('Skill berhasil diupdate!');
      } else {
        // Create new skill
        const { error } = await supabase
          .from('skills')
          .insert([formData]);

        if (error) throw error;
        alert('Skill berhasil ditambahkan!');
      }

      setShowModal(false);
      setEditingSkill(null);
      setFormData({ name: '', category: '', level: 50, icon: 'code', url: '' });
      fetchSkills();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon,
      url: skill.url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus skill ini?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Skill berhasil dihapus!');
      fetchSkills();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      code: Code2,
      database: Database,
      design: Palette,
      web: Globe
    };
    const Icon = icons[iconName] || Code2;
    return <Icon className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-light py-8 px-6 lg:px-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Code2 className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-primary">
                Kelola Skills
              </h1>
            </div>
            <p className="text-accent-gray text-sm md:text-base">Tambah, edit, atau hapus skills yang dikuasai</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              href="/admin/dashboard" 
              className="px-3 md:px-4 py-2.5 rounded-full bg-light-card border-2 border-gray-200 hover:border-primary transition-colors flex items-center space-x-2 font-semibold text-sm md:text-base"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button
              onClick={() => {
                setEditingSkill(null);
                setFormData({ name: '', category: '', level: 50, icon: 'code', url: '' });
                setShowModal(true);
              }}
              className="px-3 md:px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors flex items-center space-x-2 font-semibold text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Skill</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 md:px-5 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2 font-semibold border-2 border-red-200 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Daftar Skills</h2>
            <span className="text-sm text-accent-gray">{skills.length} skills</span>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-20 bg-light-card rounded-2xl border-2 border-dashed border-gray-300">
              <div className="p-4 bg-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Code2 className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Belum ada skills</h3>
              <p className="text-accent-gray mb-6">Mulai dengan menambahkan skill pertama Anda</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tambah Skill Pertama</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill) => {
                const IconComponent = iconMap[skill.icon || 'code'];
                
                return (
                  <div
                    key={skill.id}
                    className="group bg-light-card rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Icon & Category */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                        {IconComponent && <IconComponent className="w-6 h-6 text-purple-600" />}
                      </div>
                      <span className="px-2.5 py-1 bg-gray-100 text-xs font-medium text-primary rounded-full capitalize">
                        {skill.category}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-lg text-primary mb-4 line-clamp-1">
                      {skill.name}
                    </h3>

                    {/* URL Info */}
                    <div className="mb-4">
                      {skill.url ? (
                        <a 
                          href={skill.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-colors group"
                        >
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary truncate max-w-[200px]">
                            {skill.url.replace(/^https?:\/\//, '')}
                          </span>
                        </a>
                      ) : (
                        <div className="text-xs text-accent-gray italic">
                          URL belum diatur
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="flex-1 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors flex items-center justify-center space-x-2 font-medium text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-light-card rounded-2xl p-6 md:p-8 max-w-lg w-full my-8">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-primary">
              {editingSkill ? 'Edit Skill' : 'Tambah Skill'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">Nama Skill</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: React.js"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">Kategori</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Contoh: Frontend, Backend, Design"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">
                  URL Technology (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://reactjs.org"
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none"
                />
                <p className="text-xs text-accent-gray mt-1.5">
                  URL akan bisa diklik di website untuk redirect ke halaman tech
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-primary">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-light border-2 border-gray-200 focus:border-primary focus:outline-none"
                >
                  <option value="code">Code</option>
                  <option value="database">Database</option>
                  <option value="design">Design</option>
                  <option value="web">Web</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingSkill ? 'Update' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSkill(null);
                    setFormData({ name: '', category: '', level: 50, icon: 'code', url: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
