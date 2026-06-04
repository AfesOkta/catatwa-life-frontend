'use client';

import { useRegister } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const { mutate: registerMutate, isPending } = useRegister();

  const onSubmit = (data: RegisterFormValues) => {
    registerMutate({ email: data.email, password: data.password });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Daftar</CardTitle>
        <CardDescription>Buat akun CATATWA-LITE baru</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              required
              disabled={isPending || isSubmitting}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500 block mt-1">{String(errors.confirmPassword.message)}</span>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending || isSubmitting}>
            {isPending || isSubmitting ? 'Loading...' : 'Daftar'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}