// ✅ File: GeneratedContentList.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ContentJob, ContentData } from '@/types';
import { ContentManagerView } from './ContentManagerView';

interface GeneratedContentListProps {
  jobs: ContentJob[];
  onUpdateJobOutline: (jobId: number, newOutline: ContentData) => void;
}

export function GeneratedContentList({ jobs, onUpdateJobOutline }: GeneratedContentListProps) {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJobExpansion = (jobId: number) => {
    const jobIdStr = jobId.toString();
    const newSet = new Set(expandedJobs);
    newSet.has(jobIdStr) ? newSet.delete(jobIdStr) : newSet.add(jobIdStr);
    setExpandedJobs(newSet);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📄 Generated Content Jobs</CardTitle>
        <CardDescription>View and manage your generated content outlines</CardDescription>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No content jobs yet. Generate your first outline above!
          </p>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <Card key={job.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleJobExpansion(job.id)}>
                        {expandedJobs.has(job.id.toString()) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>{job.main_keyword}</span>
                          <Badge variant={job.status === 'completed' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>

                {expandedJobs.has(job.id.toString()) && (
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Job Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <strong>Word Count:</strong> {job.article_word_count}
                        </div>
                        <div>
                          <strong>Length:</strong> {job.article_length}
                        </div>
                        <div className="md:col-span-2">
                          <strong>Related Keywords:</strong> {job.related_keywords}
                        </div>
                        {job.tone_of_voice && (
                          <div>
                            <strong>Tone:</strong> {job.tone_of_voice}
                          </div>
                        )}
                        {job.audience_type && (
                          <div>
                            <strong>Audience:</strong> {job.audience_type}
                          </div>
                        )}
                        {job.content_format && (
                          <div>
                            <strong>Format:</strong> {job.content_format}
                          </div>
                        )}
                        {(job.competitor_url_1 || job.competitor_url_2) && (
                          <div className="md:col-span-2">
                            <strong>Competitor URLs:</strong>
                            <div className="mt-1 space-y-1">
                              {job.competitor_url_1 && (
                                <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                                  {job.competitor_url_1}
                                </div>
                              )}
                              {job.competitor_url_2 && (
                                <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                                  {job.competitor_url_2}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Semantic Keywords */}
                      {job.semantic_keywords && job.semantic_keywords.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">🎯 Primary Semantic Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.semantic_keywords.map((keyword, idx) => (
                              <Badge key={idx} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.semantic_keywords_2 && job.semantic_keywords_2.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">🎯 Secondary Semantic Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.semantic_keywords_2.map((keyword, idx) => (
                              <Badge key={idx} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content Outline */}
                      {job.outline && (
                        <div>
                          <h4 className="font-medium mb-4">📋 Content Outline</h4>
                          <ContentManagerView 
                            contentData={job.outline} 
                            onDataChange={(newOutline) => onUpdateJobOutline(job.id, newOutline)}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}