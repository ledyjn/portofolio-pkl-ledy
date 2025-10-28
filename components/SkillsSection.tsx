'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Database, Palette, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  code: Code2,
  database: Database,
  design: Palette,
  web: Globe,
};

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Multiple duplicates for seamless infinite loop (especially with few skills)
  const duplicatedSkills = [...skills, ...skills, ...skills, ...skills, ...skills, ...skills];

  if (loading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-light">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 px-6 lg:px-12 bg-light">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-4">
            Skills
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Yang Saya Gunakan</h2>
          <p className="text-base text-accent-gray max-w-2xl mx-auto">
            Tools dan teknologi yang dipelajari selama magang
          </p>
        </motion.div>

        {/* Auto-Scrolling Skills Marquee */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-light to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-light to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Container */}
          <motion.div
            className="flex gap-4 py-2"
            animate={{
              x: ['0%', '-16.666%'],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 12,
                ease: 'linear',
              },
            }}
          >
            {duplicatedSkills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon || 'code'];

              return (
                <div key={`${skill.id}-${index}`} className="group flex-shrink-0">
                  <div className="card-hover rounded-xl px-5 py-3.5 bg-light-card border-2 border-gray-200 hover:border-primary transition-all flex items-center space-x-3 shadow-sm">
                    {IconComponent && (
                      <IconComponent className="w-6 h-6 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                    )}
                    <h4 className="font-semibold text-base text-primary whitespace-nowrap">
                      {skill.name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-accent-gray">Belum ada skills yang ditambahkan</p>
          </div>
        )}
      </div>
    </section>
  );
}
