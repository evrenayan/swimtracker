import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Giriş Yap | Yüzücü Performans Takip',
    description: 'Hesabınıza giriş yapın.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
