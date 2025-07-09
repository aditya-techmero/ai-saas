// ✅ User related types
export interface User {
  username: string;
  email: string;
  name?: string;  // Optional display name
}

// ✅ Auth: Login credentials
export interface LoginCredentials {
  username: string;
  password: string;
}

// ✅ Auth: Registration data
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name?: string;  // Optional
}

// ✅ Content Job creation request (frontend ➔ backend shape)
export interface ContentJobRequest {
  title: string;
  main_keyword: string;
  related_keywords: string;
  article_word_count: number;
  article_length: string;
  tone_of_voice?: string;
  audience_type?: string;
  content_format?: string;
  competitor_url_1?: string;
  competitor_url_2?: string;
}

// ✅ Section inside Content Outline
export interface Section {
  id: string;
  headingTag: string;
  title: string;
  summary: string;
  semanticKeywords: string[];
}

// ✅ Full Content Outline structure
export interface ContentData {
  role: string;
  content: {
    chapters: Record<string, Section[]>;
  };
}

// ✅ Full Content Job (backend response shape)
export interface ContentJob {
  id: number;  // Prisma auto-incremented ID
  title: string;
  main_keyword: string;
  related_keywords: string;
  article_word_count: number;
  article_length: string;
  tone_of_voice?: string;
  audience_type?: string;
  content_format?: string;
  competitor_url_1?: string;
  competitor_url_2?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  semantic_keywords?: string[];
  semantic_keywords_2?: string[];
  outline?: ContentData;
  generated_text?: string;  // Optional: backend might return this
  created_at: string;
}
