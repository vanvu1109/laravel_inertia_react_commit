import type { TBulkAction } from '@/components/custom-bulk-action';
import type { IColumn } from '@/components/custom-table';

export type * from './auth';
export type * from './navigation';
export type * from './ui';

type SwitchableFields = "publish" | "is_blocked" | "is_highlight" | "is_hot"
export interface PageConfig<T>{
    heading: string;
    module?: string;
    filters?: IFilter[];
    cardHeading?: string;
    cardDescription?: string;
    columns?: IColumn[],
    switches?: (keyof T & SwitchableFields)[],
    actions?: TBulkAction[]
}
export interface IDateTime {
    created_at: string;
    updated_at: string;
}
export interface User extends IDateTime {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export interface ISelectOptionItem{
    label : string,
    value : string
}

export interface IFilter {
    key : string,
    placeholder : string,
    defaultValue : string,
    options : ISelectOptionItem[],
    className?: string
} 

export interface ILinks{
    url: string,
    label: string
    active: boolean
}
export interface IPaginate<T>{
    curent_page : number,
    last_page : number,
    perpage : number
    total : number
    links: ILinks[]
    data: T[]
}