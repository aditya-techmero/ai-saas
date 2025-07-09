// ✅ File: EditSectionForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X } from 'lucide-react';
import { Section } from '@/types';

interface EditSectionFormProps {
  section: Section;
  onSave: (section: Section) => void;
  onCancel: () => void;
}

export function EditSectionForm({ section, onSave, onCancel }: EditSectionFormProps) {
  const [formData, setFormData] = useState(section);
  const [keywordsInput, setKeywordsInput] = useState(section.semanticKeywords.join(', '));

  const handleSave = () => {
    const updated = {
      ...formData,
      semanticKeywords: keywordsInput.split(',').map(k => k.trim()).filter(Boolean),
    };
    onSave(updated);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1 block">Section ID</label>
        <Input 
          value={formData.id} 
          onChange={(e) => setFormData({ ...formData, id: e.target.value })} 
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Heading Tag</label>
        <Select 
          value={formData.headingTag} 
          onValueChange={(value) => setFormData({ ...formData, headingTag: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => (
              <SelectItem key={tag} value={tag}>{tag.toUpperCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Title</label>
        <Input 
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Summary</label>
        <Textarea 
          rows={3} 
          value={formData.summary} 
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })} 
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">Semantic Keywords</label>
        <Textarea 
          rows={2} 
          value={keywordsInput} 
          onChange={(e) => setKeywordsInput(e.target.value)} 
          placeholder="keyword1, keyword2, keyword3"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}
