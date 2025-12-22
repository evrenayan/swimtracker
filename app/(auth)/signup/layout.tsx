import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kayıt Ol | Yüzücü Performans Takip',
    description: 'Yeni hesap oluşturun.',
};

export default function SignupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
