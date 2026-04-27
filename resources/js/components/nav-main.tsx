    import { Link } from '@inertiajs/react';
    import { ChevronRight } from 'lucide-react';
    import {
        SidebarGroup,
        SidebarGroupLabel,
        SidebarMenu,
        SidebarMenuButton,
        SidebarMenuItem,
        SidebarMenuSubItem,
        SidebarMenuSub,
    } from '@/components/ui/sidebar';
    import { useCurrentUrl } from '@/hooks/use-current-url';
    import type { NavItem } from '@/types';
    import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { useState } from 'react';
    export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>

            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.items && item.items.length > 0;

                    return (
                        <SidebarMenuItem key={item.title}>
                            {hasChildren ? (
                                <Collapsible
                                    open={
                                        openMenus[item.title] ??
                                        item.items?.some(sub => isCurrentUrl(sub.url))
                                    }
                                    onOpenChange={(isOpen) =>
                                        setOpenMenus(prev => ({
                                            ...prev,
                                            [item.title]: isOpen
                                        }))
                                    }
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild >
                                        <SidebarMenuButton
                                            tooltip={{ children: item.title }}
                                            className='cursor-pointer'
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>

                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                   <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuButton asChild>
                                                        <Link href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
