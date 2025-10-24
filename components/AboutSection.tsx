'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Profile {
  name: string;
  bio: string;
}

export default function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('name, bio')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-light">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="text-accent-gray">Loading...</div>
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section id="about" className="py-24 px-6 lg:px-12 bg-light">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            About Me
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tentang Saya
          </h2>
          <p className="text-base text-accent-gray max-w-2xl mx-auto">
            Berkenalan lebih dekat dengan perjalanan dan pengalaman saya
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-light-card rounded-2xl border-2 border-gray-200 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-8 md:p-12">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200">
              <div className="p-4 bg-primary/5 rounded-2xl">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary">{profile.name}</h3>
                <p className="text-sm text-accent-gray">Siswa/i Magang PKL</p>
              </div>
            </div>

            {/* Bio */}
            <div className="prose prose-lg max-w-none">
              <p className="text-accent-gray leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>

            {/* Highlights */}
            <div className="grid md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Pengalaman</h4>
                  <p className="text-sm text-accent-gray">4 bulan program magang industri</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-1">Pembelajaran</h4>
                  <p className="text-sm text-accent-gray">Teknologi web modern & project real</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
