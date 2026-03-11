import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PhotoManager } from './PhotoManager';
import { AboutEditor } from './AboutEditor';
import { CreateAdminForm } from './CreateAdminForm';
import { LogOut, Image as ImageIcon, FileText, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

type Tab = 'photos' | 'about' | 'admin';

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('photos');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your portfolio content and settings.
          </p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            <TabButton
              active={activeTab === 'photos'}
              onClick={() => setActiveTab('photos')}
              icon={<ImageIcon className="w-5 h-5" />}
              label="Photos"
            />
            <TabButton
              active={activeTab === 'about'}
              onClick={() => setActiveTab('about')}
              icon={<FileText className="w-5 h-5" />}
              label="About Content"
            />
            <TabButton
              active={activeTab === 'admin'}
              onClick={() => setActiveTab('admin')}
              icon={<UserPlus className="w-5 h-5" />}
              label="Admins"
            />
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 min-h-[600px]">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'photos' && <PhotoManager />}
            {activeTab === 'about' && <AboutEditor />}
            {activeTab === 'admin' && <CreateAdminForm />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md'
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
