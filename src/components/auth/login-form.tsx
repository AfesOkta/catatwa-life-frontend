'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter')
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: { email: string; password: string }) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Masuk ke akun CATATWA-LITE Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              {...register('email')}
              required
              disabled={isPending || isSubmitting}
            />
            {errors.email && (
              <span className="text-sm text-red-500 block mt-1">{String(errors.email.message)}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              required
              disabled={isPending || isSubmitting}
            />
            {errors.password && (
              <span className="text-sm text-red-500 block mt-1">{String(errors.password.message)}</span>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending || isSubmitting}>
            {isPending || isSubmitting ? 'Loading...' : 'Login'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Daftar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}