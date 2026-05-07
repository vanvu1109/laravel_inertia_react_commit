import { Link } from '@inertiajs/react';
import { BookOpen, FolderGit2, LayoutGrid, User, Settings, Notebook } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'QL Thành Viên',
        href: '#',
        icon: User,
        items: [
            {
                title: 'Nhóm Thành Viên',
                url: '/backend/user_catalogue',
            },
            {
                title: 'Thành viên',
                url: '/backend/user',
            },
            {
                title: 'Quản lý quyền',
                url: '/backend/permission',
            },
        ]
    },
    {
        title: 'Cấu hình chung',
        href: '#',
        icon: Settings,
        items: [
            {
                title: 'QL Ngôn Ngữ',
                url: '/backend/language',
            },
        ]
    },
    {
        title: 'QL Bài Viết',
        href: '#',
        icon: Notebook,
        items: [
            {
                title: 'QL Nhóm bài viết',
                url: '/backend/post_catalogue',
            },
        ]
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
