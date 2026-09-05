import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/store/Navbar';
import { Footer } from '../components/store/Footer';
import { MobileBottomNav } from '../components/store/MobileBottomNav';
import { FloatingWhatsapp } from '../components/store/FloatingWhatsapp';

export function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ts-hitam text-ts-krem relative">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsapp />
      <MobileBottomNav />
    </div>
  );
}

