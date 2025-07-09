'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { contentApi } from '@/lib/api';
import { ContentJob } from '@/types';
import { redirect } from 'next/navigation';
import { ContentGenerator } from "@/components/ContentGenerator";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchJobs();
    }
  }, [isAuthenticated]);

  const fetchJobs = async () => {
    try {
      const jobsData = await contentApi.getMyJobs();
      setJobs(jobsData);
    } catch (err: any) {
      setError('Failed to fetch jobs');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="container mx-auto px-4 py-8">
              <ContentGenerator />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
