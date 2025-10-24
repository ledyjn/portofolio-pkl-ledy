import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/#portfolio"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>

        {/* Header */}
        <div className="glass-effect rounded-lg overflow-hidden mb-8">
          <div className="relative h-96 w-full">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                <span className="text-gray-500 text-lg">No Image Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent"></div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex items-center space-x-2 text-gray-400 mb-6">
              <Calendar className="w-5 h-5" />
              <span>{new Date(project.created_at).toLocaleDateString('id-ID', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies?.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary border border-primary/30"
                >
                  {tech}
                </span>
              ))}
            </div>

            <p className="text-gray-300 text-lg mb-6">
              {project.description}
            </p>
          </div>
        </div>

        {/* Detail Content */}
        <div className="glass-effect rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gradient">Detail Project</h2>
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: project.detail }}
          />
        </div>
      </div>
    </main>
  );
}
