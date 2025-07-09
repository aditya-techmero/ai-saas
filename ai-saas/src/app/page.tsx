'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import { redirect } from 'next/navigation';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const isHealthy = await authApi.checkHealth();
        setBackendStatus(isHealthy);
      } catch {
        setBackendStatus(false);
      }
    };

    checkBackend();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      redirect('/dashboard');
    }
  }, [isAuthenticated]);

  if (backendStatus === null) {
    return <div>Checking backend status...</div>;
  }

  if (!backendStatus) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            ❌ Backend server is not running. Please start your FastAPI server first.
            <br />
            Run: `uvicorn main:app --reload` in your terminal
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🔐 AI SaaS Login</CardTitle>
            <CardDescription>Welcome back! Please sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          🔒 Your data is probably secure with us
        </p>
      </div>
    </div>
  );
}