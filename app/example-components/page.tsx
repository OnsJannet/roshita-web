'use client';

import React from 'react';
import ExpertsConsultants from '@/components/unique/ExpertsConsultants';
import AppDownload from '@/components/unique/AppDownload';

export default function ExampleComponentsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Component Examples</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">Experts & Consultants Component</h2>
          <ExpertsConsultants />
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">App Download Component</h2>
          <AppDownload />
        </div>
      </div>
    </div>
  );
}