'use client';

import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SetupNotice() {
  const [isConfigured, setIsConfigured] = useState(true);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isPlaceholder = !supabaseUrl || supabaseUrl.includes('example') || supabaseUrl.includes('placeholder');
    setIsConfigured(!isPlaceholder);
  }, []);

  if (isConfigured) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="glass-effect border border-yellow-500/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-400 mb-1">
              ⚠️ Supabase Belum Dikonfigurasi
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              Website belum terhubung ke database. Untuk menampilkan portfolio, silakan setup Supabase terlebih dahulu.
            </p>
            <p className="text-xs text-gray-400">
              📘 Lihat panduan di <code className="bg-dark-lighter px-1 rounded">SUPABASE_SETUP.md</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
