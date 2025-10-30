import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProjectGallery from '@/components/ProjectGallery';

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

  const allImages = project.images && project.images.length > 0 
    ? project.images.filter((url: string) => url && url.trim() !== '')
    : project.image_url && project.image_url.trim() !== ''
      ? [project.image_url] 
      : [];

  return (
    <main className="min-h-screen py-20 px-6 lg:px-12 bg-light">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/#portfolio"
          className="inline-flex items-center space-x-2 text-accent-gray hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Portfolio</span>
        </Link>

        <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">{project.title}</h1>
          
          <div className="flex items-center space-x-2 text-accent-gray mb-6">
            <Calendar className="w-5 h-5" />
            <span>{new Date(project.created_at).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies?.map((tech: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1.5 text-sm font-medium rounded-full bg-primary/5 text-primary border border-primary/10"
              >
                {tech}
              </span>
            ))}
          </div>

          <p className="text-accent-gray text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {allImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-primary">Screenshots</h2>
            <ProjectGallery images={allImages} title={project.title} />
          </div>
        )}

        <div className="bg-light-card rounded-2xl border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6 text-primary">Detail Project</h2>
          <div 
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: project.detail }}
          />
        </div>
      </div>
    </main>
  );
}
