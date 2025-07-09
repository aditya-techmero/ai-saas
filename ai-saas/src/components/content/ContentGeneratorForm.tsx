'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { ContentJob } from '@/types';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  main_keyword: z.string().min(1, 'Main keyword is required'),
  related_keywords: z.string().min(1, 'Related keywords are required'),
  article_word_count: z.number().min(100, 'Word count must be at least 100'),
  article_length: z.string().min(1, 'Article length is required'),
  competitor_url_1: z.string().optional(),
  competitor_url_2: z.string().optional(),
  tone_of_voice: z.string().min(1, 'Tone of voice is required'),
  audience_type: z.string().min(1, 'Audience type is required'),
  content_format: z.string().min(1, 'Content format is required'),
});

type ContentJobRequest = z.infer<typeof contentSchema>;

interface ContentGeneratorFormProps {
  onJobCreated: (job: ContentJob) => void;
}

// Dropdown options
const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Authoritative', label: 'Authoritative' },
  { value: 'Conversational', label: 'Conversational' },
  { value: 'Formal', label: 'Formal' },
  { value: 'Humorous', label: 'Humorous' },
  { value: 'Inspirational', label: 'Inspirational' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Persuasive', label: 'Persuasive' },
];

const AUDIENCE_OPTIONS = [
  { value: 'General Readers', label: 'General Readers' },
  { value: 'Beginners', label: 'Beginners' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced/Experts', label: 'Advanced/Experts' },
  { value: 'Business Professionals', label: 'Business Professionals' },
  { value: 'Students', label: 'Students' },
  { value: 'Entrepreneurs', label: 'Entrepreneurs' },
  { value: 'Marketers', label: 'Marketers' },
  { value: 'Developers', label: 'Developers' },
  { value: 'Decision Makers', label: 'Decision Makers' },
  { value: 'Industry Specialists', label: 'Industry Specialists' },
];

const CONTENT_FORMAT_OPTIONS = [
  { value: 'Blog Post', label: 'Blog Post' },
  { value: 'How-to Guide', label: 'How-to Guide' },
  { value: 'Listicle', label: 'Listicle' },
  { value: 'Tutorial', label: 'Tutorial' },
  { value: 'Case Study', label: 'Case Study' },
  { value: 'Review', label: 'Review' },
  { value: 'Comparison', label: 'Comparison' },
  { value: 'Ultimate Guide', label: 'Ultimate Guide' },
  { value: 'News Article', label: 'News Article' },
  { value: 'Opinion Piece', label: 'Opinion Piece' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Research Article', label: 'Research Article' },
];

export function ContentGeneratorForm({ onJobCreated }: ContentGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContentJobRequest>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      main_keyword: '',
      related_keywords: '',
      article_word_count: 1500,
      article_length: 'short',
      tone_of_voice: 'Friendly',
      audience_type: 'General Readers',
      content_format: 'Blog Post',
    },
  });

  const onSubmit = async (data: ContentJobRequest) => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/create-job`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`
          },
          body: JSON.stringify(data),
        });
      
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const responseBody = isJson ? await response.json() : null;
      
        if (!response.ok) {
          throw new Error(responseBody?.error || 'Failed to create job');
        }
      
        onJobCreated(responseBody);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      }finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Generate Content Outline</CardTitle>
        <CardDescription>Fill out the form to generate AI-powered outlines</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="title" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} placeholder="Enter title" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="main_keyword" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Keyword</FormLabel>
                  <FormControl><Input {...field} placeholder="Keyword" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField name="related_keywords" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Related Keywords</FormLabel>
                <FormControl><Textarea {...field} placeholder="Comma separated keywords" rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="article_word_count" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Word Count</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="3600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="article_length" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Article Length</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="very long">10,000+ words - 25+ H2</SelectItem>
                      <SelectItem value="long">5000-10,000 words - 18+ H2</SelectItem>
                      <SelectItem value="medium">3600-5000 words - 15+ H2</SelectItem>
                      <SelectItem value="short">1500-3600 words - 10+ H2</SelectItem>
                      <SelectItem value="very short">1000+ words - 5+ H2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField name="tone_of_voice" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone of Voice</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="audience_type" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Audience Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AUDIENCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField name="content_format" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTENT_FORMAT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField name="competitor_url_1" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor URL 1 (Optional)</FormLabel>
                  <FormControl><Input {...field} placeholder="https://example.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="competitor_url_2" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor URL 2 (Optional)</FormLabel>
                  <FormControl><Input {...field} placeholder="https://example.com" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Content Outline'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}