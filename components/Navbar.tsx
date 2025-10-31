'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-light/80 backdrop-blur-md border-b border-gray-200">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <span className="text-lg font-bold text-primary block leading-tight">
                Ledy Jentri
              </span>
              <span className="text-xs text-accent-gray">XII RPL A</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            <Link href="/" className="text-primary hover:opacity-60 transition-opacity font-medium">
              Home
            </Link>
            <Link
              href="#about"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              About
            </Link>
            <Link
              href="#internship"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              Profile Iduka
            </Link>
            <Link
              href="#portfolio"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              Projek
            </Link>
            <Link
              href="#skills"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              Skills
            </Link>
            <Link
              href="#gallery"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              Gallery
            </Link>
            <Link
              href="#contact"
              className="text-primary hover:opacity-60 transition-opacity font-medium"
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="px-6 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-light border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#about"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="#internship"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profile Iduka
            </Link>
            <Link
              href="#portfolio"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Projek
            </Link>
            <Link
              href="#skills"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Skills
            </Link>
            <Link
              href="#gallery"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="#contact"
              className="block py-2 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="btn-primary inline-flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
