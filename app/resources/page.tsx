'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 pt-32 pb-12 relative z-[2]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-5xl font-bold text-[#0052FF]">Proposals</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Vote on important proposals and help shape the future of the ABC DAO.
            </p>
          </div>
        </div>
      </div>

      {/* Work in Progress Notice */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-500" />
            <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400">
              Work in Progress
            </h2>
          </div>
          <p className="text-lg text-yellow-700 dark:text-yellow-300">
            The proposals voting system is currently under development. Soon, you'll be able to:
          </p>
          <ul className="mt-4 space-y-2 text-yellow-700 dark:text-yellow-300">
            <li className="flex items-center gap-2">
              • View active governance proposals
            </li>
            <li className="flex items-center gap-2">
              • Cast votes using your Base tokens
            </li>
            <li className="flex items-center gap-2">
              • Track proposal outcomes and implementation
            </li>
            <li className="flex items-center gap-2">
              • Participate in community discussions
            </li>
          </ul>
          <p className="mt-6 text-yellow-700 dark:text-yellow-300">
            Check back soon for updates. We're working hard to bring you a robust governance platform!
          </p>
        </div>
      </div>
    </div>
  );
}
