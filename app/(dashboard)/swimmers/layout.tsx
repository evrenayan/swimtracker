import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sporcular | Yüzücü Performans Takip',
    description: 'Sporcu listesi ve yönetimi.',
};

export default function SwimmersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
