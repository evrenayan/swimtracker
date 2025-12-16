'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signIn } from '@/lib/auth/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, error } = await signIn(email, password);

      if (error) {
        setError(error);
        toast.error(error);
        setIsLoading(false);
        return;
      }

      if (user) {
        // toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');

        // Redirect based on role
        if (user.profile?.role === 'admin') {
          router.push('/swimmers');
        } else {
          router.push('/swimmers');
        }
        router.refresh();
      }
    } catch (err) {
      const errorMsg = 'Giriş sırasında bir hata oluştu.';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Yüzücü Performans Takip
            </h1>
            <p className="text-gray-600">
              Hesabınıza giriş yapın
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              id="email"
              label="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              id="password"
              label="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifrenizi girin"
              error={error}
              required
              disabled={isLoading}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Giriş Yap
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{' '}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Kayıt Olun
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Yüzme kulüplerinin sporcularının performanslarını takip edin
        </p>
      </div>
    </div>
  );
}
