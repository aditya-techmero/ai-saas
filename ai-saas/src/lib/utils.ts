import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date utility
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Truncate text utility
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Format content status
export function formatStatus(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    default:
      return capitalize(status)
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Local storage utilities with error handling
export const storage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key)
      }
      return null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  set: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  }
}

// API error handler
export function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response;
    if (response?.data?.detail) {
      return response.data.detail;
    }
    if (response?.data?.message) {
      return response.data.message;
    }
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as any).message;
  }
  
  return 'An unexpected error occurred';
}

// Format content type display
export function formatContentType(type: string): string {
  switch (type.toLowerCase()) {
    case 'blog':
      return '📝 Blog Post'
    case 'social media post':
      return '📱 Social Media Post'
    case 'product description':
      return '🏷️ Product Description'
    default:
      return `📄 ${capitalize(type)}`
  }
}

// Format tone of voice display
export function formatTone(tone: string): string {
  switch (tone.toLowerCase()) {
    case 'friendly':
      return '😊 Friendly'
    case 'professional':
      return '💼 Professional'
    case 'casual':
      return '😎 Casual'
    case 'funny':
      return '😄 Funny'
    default:
      return `🎭 ${capitalize(tone)}`
  }
}