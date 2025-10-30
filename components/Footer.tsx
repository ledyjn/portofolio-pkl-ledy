'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  email: string;
  github: string;
  linkedin: string;
}

export default function Footer() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('email, github, linkedin')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  return (
    <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gradient">Ledy Jentri Meiza</h3>
            <p className="text-gray-400 text-sm">
              Siswa XII RPL A - Projek Praktek Kerja Lapangan menampilkan hasil pembelajaran selama 4 bulan magang di industri.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Projek
                </a>
              </li>
              <li>
                <a href="#skills" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Skills
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {profile?.github && (
                <a 
                  href={profile.github}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.linkedin && (
                <a 
                  href={profile.linkedin}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.email && (
                <a 
                  href={`mailto:${profile.email}`}
                  className="p-2 glass-effect rounded-lg hover:bg-primary/20 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Ledy Jentri Meiza - XII RPL A. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
