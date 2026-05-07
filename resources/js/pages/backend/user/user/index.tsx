import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import type { PageConfig } from '@/types';
import CustomPageHeading from '@/components/custom-page-heading';
import CustomCard from '@/components/custom-card';
import { Link } from '@inertiajs/react';
import { Edit, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CusTomFilter from '@/components/custom-filter';
import { chooseAll, filter } from '@/constants/filter';
import CustomTable from '@/components/custom-table';
import type { IPaginate, User } from '@/types';
import React, { useMemo } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Switch } from "@/components/ui/switch"
import CusTomPagination from '@/components/custom-pagination';
import CustomConFirmDelete from '@/components/custom-confirm-delete';
import type { SwitchState } from '@/hooks/use-switches';
import useFilter from '@/hooks/use-filter';
import useTable from '@/hooks/use-table';
import { Input } from '@/components/ui/input';
import CustomBulkAction from '@/components/custom-bulk-action';
import { UserCatalogue } from '../user_catalogue/save';
import { IFilter } from '@/types'; 
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Quản lý thành viên',
        href: '/backend/user',
    },
];

const pageConfig: PageConfig<User> = {
    heading: 'Quản Lý Thành viên',
    module: '/backend/user',
    cardHeading: 'Bảng Quản Lý Danh Sách Thành Viên',
    cardDescription: 'Quản lý thông tin danh sách các Thành viên, sử dụng các chức năng để lọc dữ liệu... ',
    filters: [...filter],
    columns : [
        {key: 'checkbox', label: '', className: 'w-[60px]'},
        {key: 'id', label: 'ID', className: 'w-[100px]'},
        {key: 'name', label: 'Tên thành viên', className: 'w-[15%]'},
        {key: 'email', label: 'Email', className: 'w-[15%]'},
        {key: 'user_catalogues', label: 'Nhóm thành viên', className: 'w-[15%]'},
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
    item: User,
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
        <TableCell>{item.email}</TableCell>
        <TableCell>
            {item.user_catalogues?.map((catalogue) => (
                <div key={catalogue.id} className='inline-block px-2 py-1 text-xs rounded-[5px] bg-gray-200 text-gray-700 mr-1'>
                    {catalogue.name}
                </div>
            ))}
        </TableCell>
        <TableCell className='text-center'>{item.created_at}</TableCell>
        <TableCell className='text-center'>{item.updated_at}</TableCell>    
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

interface IUserIndexProps {
    users : User[],
    records: IPaginate<User>,
    userCatalogues: UserCatalogue[]
}

export default function UserIndex({users, records, userCatalogues}: IUserIndexProps) {
    const { filters: baseFilters } = useFilter({users, defaultFilters: pageConfig.filters, isShowCreatorFilter: false})

    const filters = useMemo(() => {
        return [
            ...baseFilters,
            {
                key: 'user_catalogues',
                placeholder : 'Chọn nhóm thành viên',
                options: [
                    ...userCatalogues.map((catalogue) => ({
                        label: catalogue.name,
                        value: catalogue.id.toString()
                    }))
                ],
                defaultValue: [] as string[],
                className: 'w-[180px]',
                type: 'multiple',
                operator: 'in',
                field: 'id'
            } as IFilter       
        ]
    }, [userCatalogues, baseFilters])

    const {
        switches, 
        handleSwitchChange,
        handleCheckAll,
        isAllChecked, 
        handelCheckItem,
        selectedIds,
        setSelectedIds
    } = useTable<User>({pageConfig, rerords: records.data})

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
                            render={(item: User) => (
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
