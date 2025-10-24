'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, Portfolio } from '@/lib/supabase';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  FolderOpen,
  LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';

export default function PortfolioAdmin() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }

    await fetchPortfolios();
  };

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus projek ini?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Portfolio berhasil dihapus!');
      fetchPortfolios();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary rounded-lg">
                <FolderOpen className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-primary">
                Kelola Projek
              </h1>
            </div>
            <p className="text-accent-gray text-sm md:text-base">Tambah, edit, atau hapus projek</p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              href="/admin/dashboard" 
              className="px-3 md:px-4 py-2.5 rounded-full bg-light-card border-2 border-gray-200 hover:border-primary transition-colors flex items-center space-x-2 font-semibold text-sm md:text-base"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/admin/dashboard/new"
              className="px-3 md:px-5 py-2.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors flex items-center space-x-2 font-semibold text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah Projek</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 md:px-5 py-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2 font-semibold border-2 border-red-200 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Portfolio List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">Daftar Portfolio</h2>
            <span className="text-sm text-accent-gray">{portfolios.length} portfolio</span>
          </div>

          {portfolios.length === 0 ? (
            <div className="text-center py-20 bg-light-card rounded-2xl border-2 border-dashed border-gray-300">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FolderOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Belum ada portfolio</h3>
              <p className="text-accent-gray mb-6">Mulai dengan menambahkan portfolio pertama Anda</p>
              <Link href="/admin/dashboard/new" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Tambah Portfolio Pertama</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="group bg-light-card rounded-2xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-32 bg-gray-100 rounded-xl overflow-hidden mb-4">
                    {portfolio.image_url ? (
                      <Image
                        src={portfolio.image_url}
                        alt={portfolio.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <FolderOpen className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-primary mb-2 line-clamp-2">
                    {portfolio.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-accent-gray mb-4 line-clamp-2">
                    {portfolio.description}
                  </p>

                  {/* Technologies */}
                  {portfolio.technologies && portfolio.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {portfolio.technologies.slice(0, 2).map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-xs font-medium text-primary rounded-full">
                          {tech}
                        </span>
                      ))}
                      {portfolio.technologies.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-xs font-medium text-accent-gray rounded-full">
                          +{portfolio.technologies.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <Link
                      href={`/admin/dashboard/edit/${portfolio.id}`}
                      className="flex-1 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center justify-center space-x-2 font-medium text-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(portfolio.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
