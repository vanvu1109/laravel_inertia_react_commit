import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    
    const { flash } = usePage<{ flash?: { success?: string; error?: string; warning?: string; info?: string } }>().props;

    useEffect(() => {
        if (!flash) {
            return
        }

        if (flash.success) {
            toast.success('Thành công', {
                description: String(flash.success),
                id: 'success'
            });
        }

        if (flash.error) {
            toast.error('Có lỗi xảy ra', {
                description: String(flash.error),
                id: 'error'
            });
        }

        if (flash.warning) {
            toast.warning('Cảnh báo', {
                description: String(flash.warning),
                id: 'warning'
            });
        }

        if (flash.info) {
            toast.info('Thông tin', {
                description: String(flash.info),
                id: 'info'
            });
        }

    }, [flash]); 

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster richColors position="top-right" />
        </AppLayoutTemplate>
    );
}