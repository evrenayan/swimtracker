'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { signUp } from '@/lib/auth/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            const errorMsg = 'Şifreler eşleşmiyor.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        // Validate password length
        if (password.length < 6) {
            const errorMsg = 'Şifre en az 6 karakter olmalıdır.';
            setError(errorMsg);
            toast.error(errorMsg);
            return;
        }

        setIsLoading(true);

        try {
            const { user, error } = await signUp(email, password, fullName);

            if (error) {
                setError(error);
                toast.error(error);
                setIsLoading(false);
                return;
            }

            if (user) {
                toast.success('Kayıt başarılı! E-posta adresinizi doğrulayın.');
                toast.success('Giriş sayfasına yönlendiriliyorsunuz...');

                // Redirect to login
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            const errorMsg = 'Kayıt sırasında bir hata oluştu.';
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
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
                                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Hesap Oluştur
                        </h1>
                        <p className="text-gray-600">
                            Yeni bir hesap oluşturun
                        </p>
                    </div>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="text"
                            id="fullName"
                            label="Ad Soyad"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Adınız ve soyadınız"
                            required
                            disabled={isLoading}
                        />

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
                            placeholder="En az 6 karakter"
                            required
                            disabled={isLoading}
                        />

                        <Input
                            type="password"
                            id="confirmPassword"
                            label="Şifre Tekrar"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Şifrenizi tekrar girin"
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
                            Kayıt Ol
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Zaten hesabınız var mı?{' '}
                            <Link
                                href="/login"
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                                Giriş Yapın
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Kayıt olarak sporcu performanslarını takip edebilirsiniz
                </p>
            </div>
        </div>
    );
}
