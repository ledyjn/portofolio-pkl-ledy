'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LoadingPage } from '@/components/LoadingSpinner';
import { 
  LogOut, 
  Code2, 
  FolderOpen,
  Home,
  LayoutDashboard,
  Briefcase,
  Clock,
  User,
  Mail,
  Globe as GlobeIcon,
  Github,
  Linkedin,
  Instagram
} from 'lucide-react';

interface Activity {
  type: 'project' | 'skill';
  title: string;
  time: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/admin/login');
      return;
    }
    
    await fetchStats();
  };

  const fetchStats = async () => {
    try {
      const [portfolioRes, skillRes, recentPortfolios, recentSkills, profileRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('title, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('skills').select('name, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('profile').select('*').limit(1).single()
      ]);

      setPortfolioCount(portfolioRes.count || 0);
      setSkillCount(skillRes.count || 0);
      setProfileData(profileRes.data || null);

      // Combine and sort activities
      const activities: Activity[] = [];
      
      recentPortfolios.data?.forEach(p => {
        activities.push({
          type: 'project',
          title: p.title,
          time: formatTime(p.created_at)
        });
      });
      
      recentSkills.data?.forEach(s => {
        activities.push({
          type: 'skill',
          title: s.name,
          time: formatTime(s.created_at)
        });
      });

      // Sort by most recent
      activities.sort((a, b) => b.time.localeCompare(a.time));
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <LoadingPage text="Memuat dashboard..." />;
  }

  return (
    <main className="min-h-screen bg-light py-8 px-6 lg:px-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Dashboard Admin
            </h1>
            <p className="text-accent-gray text-sm md:text-base">Kelola portfolio dan skills Anda</p>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Link 
              href="/" 
              className="px-3 md:px-4 py-2.5 rounded-full bg-light-card border-2 border-gray-200 hover:border-primary transition-colors flex items-center space-x-2 font-semibold text-sm md:text-base"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
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

        {/* Stats Cards - Compact Horizontal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center space-x-3">
            <div className="p-2 bg-gray-300 rounded-lg">
              <FolderOpen className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-accent-gray">Total Projek</p>
              <p className="text-xl font-bold text-primary">{portfolioCount}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center space-x-3">
            <div className="p-2 bg-gray-300 rounded-lg">
              <Code2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-accent-gray">Total Skills</p>
              <p className="text-xl font-bold text-primary">{skillCount}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center space-x-3">
            <div className="p-2 bg-gray-300 rounded-lg">
              <Briefcase className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-accent-gray">Status PKL</p>
              <p className="text-xl font-bold text-primary">
                {portfolioCount >= 4 ? '✓ Lengkap' : `${portfolioCount}/4`}
              </p>
            </div>
          </div>
        </div>

        {/* Main Options - Elegant */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Card */}
          <Link
            href="/admin/portfolio"
            className="group bg-light-card rounded-2xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 bg-gray-100 rounded-xl w-fit mb-4 group-hover:bg-primary transition-colors">
              <FolderOpen className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Kelola Projek</h2>
            <p className="text-accent-gray mb-4 text-sm leading-relaxed">
              Tambah, edit, atau hapus projek
            </p>
            <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Buka</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Skills Card */}
          <Link
            href="/admin/skills"
            className="group bg-light-card rounded-2xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 bg-gray-100 rounded-xl w-fit mb-4 group-hover:bg-primary transition-colors">
              <Code2 className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Kelola Skills</h2>
            <p className="text-accent-gray mb-4 text-sm leading-relaxed">
              Tambah, edit, atau hapus skills
            </p>
            <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Buka</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Profile Card */}
          <Link
            href="/admin/profile"
            className="group bg-light-card rounded-2xl p-6 border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300"
          >
            <div className="p-4 bg-gray-100 rounded-xl w-fit mb-4 group-hover:bg-primary transition-colors">
              <User className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-2">Kelola Profile</h2>
            <p className="text-accent-gray mb-4 text-sm leading-relaxed">
              Edit bio, contact, social media
            </p>
            <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Buka</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity - REAL DATA */}
          <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-primary">Aktivitas Terbaru</h3>
            </div>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      {activity.type === 'project' ? (
                        <FolderOpen className="w-4 h-4 text-primary" />
                      ) : (
                        <Code2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">
                        {activity.type === 'project' ? 'Projek' : 'Skill'}: {activity.title}
                      </p>
                      <p className="text-xs text-accent-gray">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-accent-gray text-sm">
                  Belum ada aktivitas
                </div>
              )}
            </div>
          </div>

          {/* Profile Quick Edit */}
          <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-bold text-primary">Profile & Kontak</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <Mail className="w-4 h-4 text-accent-gray" />
                <div className="flex-1">
                  <p className="text-xs text-accent-gray">Email</p>
                  <p className="text-sm font-medium text-primary">{profileData?.email || 'Belum diisi'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
                <GlobeIcon className="w-4 h-4 text-accent-gray" />
                <div className="flex-1">
                  <p className="text-xs text-accent-gray">Website</p>
                  <p className="text-sm font-medium text-primary">{profileData?.website || 'Belum diisi'}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-accent-gray mb-3">Social Media</p>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Github className="w-4 h-4 text-primary" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Linkedin className="w-4 h-4 text-primary" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Instagram className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
