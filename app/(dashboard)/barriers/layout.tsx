import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Baraj Yönetimi | Yüzücü Performans Takip',
    description: 'Yüzme baraj derecelerini görüntüleyin ve yönetin.',
};

export default function BarriersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
