import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, User } from '@/types';
import type { PageConfig } from '@/types';
import CustomPageHeading from '@/components/custom-page-heading';
import CustomCard from '@/components/custom-card';
import { Link } from '@inertiajs/react';
import { Edit, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CusTomFilter from '@/components/custom-filter';
import { filter } from '@/constants/filter';
import CustomTable from '@/components/custom-table';
import type { IPaginate } from '@/types';
import type { UserCatalogue } from './save';
// import { useEffect } from 'react';
import React, { } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Switch } from "@/components/ui/switch"
import CusTomPagination from '@/components/custom-pagination';
import CustomConFirmDelete from '@/components/custom-confirm-delete';
import type { SwitchState } from '@/hooks/use-switches';
import useFilter from '@/hooks/use-filter';
import useTable from '@/hooks/use-table';
import { Input } from '@/components/ui/input';
import CustomBulkAction from '@/components/custom-bulk-action';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Quản lý nhóm thành viên',
        href: '/backend/user_catalogue',
    },
];

const pageConfig: PageConfig<UserCatalogue> = {
    heading: 'Quản Lý Nhóm Thành Viên',
    module: '/backend/user_catalogue',
    cardHeading: 'Bảng Quản Lý Danh Sách Nhóm Thành Viên',
    cardDescription: 'Quản lý thông tin danh sách các nhóm thành viên, sử dụng các chức năng để lọc dữ liệu... ',
    filters: [...filter],
    columns : [
        {key: 'checkbox', label: '', className: 'w-[60px]'},
        {key: 'id', label: 'ID', className: 'w-[100px]'},
        {key: 'name', label: 'Tên nhóm', className: 'w-[15%]'},
        {key: 'description', label: 'Mô tả', className: 'w-[25%]'},
        {key: 'creators', label: 'Người tạo', className: 'w-[15%]'},
        {key: 'created_at', label: 'Ngày tạo', className: 'text-center'},
        {key: 'updated_at', label: 'Ngày sửa', className: 'text-center'},
        {key: 'publish', label: 'Trạng thái', className: 'text-center'},
        {key: 'action', label: 'Thao tác', className: 'w-[120px] text-center'},
    ],
    switches: ['publish'] as const
}

type SwitchField = NonNullable<typeof pageConfig.switches>[number]

const TableRowComponent = React.memo(({
    item,
    switches,
    onSwitchChange,
    onCheckItem,
    checked
}: {
    item: UserCatalogue,
    switches: SwitchState<SwitchField>,
    onSwitchChange: (id: number, field: SwitchField, curentValue: string) => () => void,
    onCheckItem: (id: number, checked: boolean) => void,
    checked: boolean
}) => {
    const effectivePublish = switches[item.id]?.values.publish ?? item.publish
    const loading = switches[item.id]?.loading ?? false

    return (
        <TableRow key={item.id} className={`cursor-pointer ${checked ? 'bg-[#ffc]' : ''}`}>
        <TableCell className='font-medium'>
            <input 
                type="checkbox" 
                className="cursor-pointer size-4"
                checked={checked}
                onChange={e => onCheckItem(item.id, e.target.checked)}
            />
        </TableCell>
        <TableCell>{item.id}</TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.description}</TableCell>
        <TableCell>{item.creators.name}</TableCell>
        <TableCell>{item.created_at}</TableCell>
        <TableCell>{item.updated_at}</TableCell>    
        <TableCell className='text-center '>
            <Switch 
                className='cursor-pointer' 
                checked={effectivePublish === '2'} 
                onCheckedChange={onSwitchChange(item.id, 'publish', effectivePublish)}
                disabled={loading}
            />
        </TableCell>
        <TableCell className='text-center'>
           <div className='flex items-center justify-center space-x-1'>
                <Link href={`${pageConfig.module}/${item.id}/edit`}>
                    <Button className='size-7 p-0 bg-[#0088ff] hover:bg-[#0088ff]/80 text-white cursor-pointer rounded-[5px]'>
                        <Edit/>
                    </Button>
                </Link>

               <CustomConFirmDelete
                    id={item.id}
                    module={pageConfig.module}
               > 
                    <Button className='size-7 p-0 bg-[#ff0000] hover:bg-[#ff0000]/80 text-white cursor-pointer rounded-[5px]'>
                        <Trash/>
                    </Button>
               </CustomConFirmDelete>
           </div>
        </TableCell>
    </TableRow>
    )
}
)

interface IUserCatalogueIndexProps {
    users : User[],
    records: IPaginate<UserCatalogue>
}

export default function UserCatalogueIndex({users, records}: IUserCatalogueIndexProps) {

    const {
        switches, 
        handleSwitchChange,
        handleCheckAll,
        isAllChecked, 
        handelCheckItem,
        selectedIds,
        setSelectedIds
    } = useTable<UserCatalogue>({pageConfig, rerords: records.data})
    const { filters } = useFilter({users, defaultFilters: pageConfig.filters})

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageConfig.heading} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
                <CustomPageHeading
                    heading={pageConfig.heading}
                    breadcrumbs={breadcrumbs}
                />
                <div className='page-container'>
                    <CustomCard
                        title={pageConfig.cardHeading}
                        description={pageConfig.cardDescription}
                        isShowHeader={true}
                        isShowFooter={true}
                        footerChildren={
                            <CusTomPagination 
                                links={records.links} 
                            />
                        }
                    >
                        <div className='flex items-center justify-between mb-[10px]'>
                           <div className='flex items-center justify-center'>
                                {selectedIds.length > 0  && (
                                    <CustomBulkAction
                                        className='mr-[10px] w-[180px]'
                                        module={pageConfig.module}
                                        selectedIds={selectedIds}
                                        setSelectedIds={setSelectedIds}
                                    />
                                )}
                                <CusTomFilter
                                    filters={filters}
                                />
                           </div>
                            <Link href={`${pageConfig.module}/create`}>
                                <Button className='btn btn-primary flex items-center justify-center bg-[#ed5565] text-white hover:bg-[#ed5565]/80 cursor-pointer'>
                                    <PlusCircle className=" h-4 w-4" />
                                    Thêm mới bản ghi
                                </Button>
                            </Link>
                        </div>
                        <CustomTable 
                            data={records.data}
                            columns={[
                                {
                                    key: 'checkbox', 
                                    label: (
                                        <Input 
                                            type='checkbox'
                                            className='size-4 cursor-pointer'
                                            onChange={e => handleCheckAll(e.target.checked)}
                                            checked={isAllChecked}
                                        />
                                    ),
                                    className: 'w-[60px]'
                                },
                                ...pageConfig.columns?.filter(col => col.key !== 'checkbox') ?? []
                            ]}
                            render={(item: UserCatalogue) => (
                                <TableRowComponent 
                                    key={item.id}
                                    item={item}
                                    switches={switches}
                                    onSwitchChange={handleSwitchChange}
                                    onCheckItem={handelCheckItem}
                                    checked={selectedIds.includes(item.id)}
                                />
                            )} 
                        />

                    </CustomCard>
                </div>
            </div>
        </AppLayout>
    );
}
