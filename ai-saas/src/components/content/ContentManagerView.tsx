'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EditSectionForm } from './EditSectionForm';
import { Section, ContentData } from '@/types';

interface ContentManagerViewProps {
  contentData: ContentData;
  onDataChange: (data: ContentData) => void;
}

export function ContentManagerView({ contentData, onDataChange }: ContentManagerViewProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const toggleChapter = (chapterKey: string) => {
    const newExpanded = new Set(expandedChapters);
    newExpanded.has(chapterKey) ? newExpanded.delete(chapterKey) : newExpanded.add(chapterKey);
    setExpandedChapters(newExpanded);
  };

  const deleteSection = (chapterKey: string, sectionId: string) => {
    const newData = { ...contentData };
    newData.content.chapters[chapterKey] = newData.content.chapters[chapterKey].filter(
      (section) => section.id !== sectionId
    );
    if (newData.content.chapters[chapterKey].length === 0) {
      delete newData.content.chapters[chapterKey];
    }
    onDataChange(newData);
  };

  const editSection = (chapterKey: string, updatedSection: Section) => {
    const newData = { ...contentData };
    const sectionIndex = newData.content.chapters[chapterKey].findIndex(
      (section) => section.id === updatedSection.id
    );
    if (sectionIndex !== -1) {
      newData.content.chapters[chapterKey][sectionIndex] = updatedSection;
      onDataChange(newData);
    }
    setEditingSection(null);
  };

  return (
    <div className="space-y-3">
      {Object.entries(contentData.content.chapters).map(([chapterKey, sections]) => (
        <Card key={chapterKey} className="overflow-hidden">
          <CardHeader 
            className="pb-3 cursor-pointer hover:bg-gray-50" 
            onClick={() => toggleChapter(chapterKey)}
          >
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                {expandedChapters.has(chapterKey) ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
                <span className="capitalize">{chapterKey.replace(/-/g, ' ')}</span>
                <Badge variant="outline" className="text-xs">{sections.length}</Badge>
              </div>
            </CardTitle>
          </CardHeader>

          {expandedChapters.has(chapterKey) && (
            <CardContent className="pt-0">
              <div className="space-y-2">
                {sections.map((section) => (
                  <div 
                    key={section.id} 
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {section.headingTag.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500 truncate">{section.id}</span>
                      </div>
                      <h4 className="font-medium text-sm">{section.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{section.summary}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {section.semanticKeywords.slice(0, 3).map((keyword, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                        {section.semanticKeywords.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{section.semanticKeywords.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setEditingSection(section)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Section</DialogTitle>
                          </DialogHeader>
                          <EditSectionForm
                            section={editingSection || section}
                            onSave={(updated) => editSection(chapterKey, updated)}
                            onCancel={() => setEditingSection(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteSection(chapterKey, section.id)} 
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}