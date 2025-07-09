'use client';

import { useEffect, useState } from 'react';
import { ContentJob, ContentData } from '@/types';
import { ContentGeneratorForm } from './content/ContentGeneratorForm';
import { GeneratedContentList } from './content/GeneratedContentList';

export function ContentGenerator() {
  const [jobs, setJobs] = useState<ContentJob[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-jobs`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleJobCreated = (job: ContentJob) => {
    setJobs(prev => [job, ...prev]);
  };

  const handleUpdateJobOutline = (jobId: number, newOutline: ContentData) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, outline: newOutline } : job
    ));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">📝 Content Generator</h1>
          <p className="text-muted-foreground">Generate AI content with detailed outlines</p>
        </div>
      </div>

      <div className="grid gap-8">
        <ContentGeneratorForm onJobCreated={handleJobCreated} />
        <GeneratedContentList jobs={jobs} onUpdateJobOutline={handleUpdateJobOutline} />
      </div>
    </div>
  );
}