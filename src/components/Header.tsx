"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="p-4 bg-dw-background-deep border-b border-dw-background-glass backdrop-blur-sm fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Data Warfare Logo" className="h-8" />
          <span className="text-xl font-bold text-dw-text-primary">Data Warfare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/dashboard" className="text-dw-text-secondary hover:text-dw-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/pricing" className="text-dw-text-secondary hover:text-dw-primary transition-colors">
            Pricing
          </Link>
          <Link to="/contact" className="text-dw-text-secondary hover:text-dw-primary transition-colors">
            Contact
          </Link>
          <Link to="/auth" className="text-dw-text-secondary hover:text-dw-primary transition-colors">
            Login
          </Link>
          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle menu">
                <Menu className="h-6 w-6 text-dw-text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-dw-background-deep border-l border-dw-background-glass p-6">
              <div className="flex justify-between items-center mb-6">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <img src="/logo.png" alt="Data Warfare Logo" className="h-8" />
                  <span className="text-xl font-bold text-dw-text-primary">Data Warfare</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6 text-dw-text-primary" />
                </Button>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link to="/dashboard" className="text-dw-text-secondary hover:text-dw-primary transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/pricing" className="text-dw-text-secondary hover:text-dw-primary transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Pricing
                </Link>
                <Link to="/contact" className="text-dw-text-secondary hover:text-dw-primary transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Contact
                </Link>
                <Link to="/auth" className="text-dw-text-secondary hover:text-dw-primary transition-colors text-lg" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Button asChild className="w-full">
                  <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;