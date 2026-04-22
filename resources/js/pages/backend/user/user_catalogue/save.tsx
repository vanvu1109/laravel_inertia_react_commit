import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, IDateTime, PageConfig, User } from '@/types';
import  CusTomPageHeading from '@/components/custom-page-heading';
import CustomCard from '@/components/custom-card';
import CustomNotice from '@/components/custom-notice';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import  { LoaderCircle } from 'lucide-react'; 
import user_catalogue from '@/routes/user_catalogue';
import {Textarea} from '@/components/ui/textarea';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from '@/components/ui/checkbox';
import { Permission } from '../../permission/permission/save';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url, 
    },
    {
        title: 'Thêm mới nhóm thành viên',
        href: '/backend/user_catalogue/create',
    },
];

const pageConfig:PageConfig<UserCatalogue> = {
    heading: 'Quản Lý Nhóm Thành Viên',
}

export interface UserCatalogue extends IDateTime{
    id: number,
    name: string,
    publish: string,
    description: string,
    canonical: string,
    creators: User,
    permissions: Permission[]
}

interface UserCatalogueSaveProps {
    record?: UserCatalogue;
    permissions: Permission[]
}

interface IPermissionModule {
    title: string,
    permissions: Permission[]
}

interface IGruopPermissions {
   [key: string]: IPermissionModule
}

const getModulePermissions = (canonical: string) => {
    const name:string = canonical.split(':')[0]
    const moduleTtile: Record<string, string> = {
        'permission' : 'Quản lý quyền',
        'user_catalogue' : 'Quản lý quyền nhóm thành viên',
        'user' : 'Quản lý quyền thành viên'
    }

    return moduleTtile[name] || name
}

export default function UserCatalogueSave({ record, permissions }:UserCatalogueSaveProps) {
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
    const [submitType, setSubmitType] = useState('');

    const isEdit = !!record?.id

    const permissionCount = useMemo(() => {
        return {
            selected: selectedPermissionIds.length,
            total: permissions.length
        }
    }, [selectedPermissionIds, permissions])

    const handleSelectAll = () => {
        const allIds = permissions.map(p => p.id)
        setSelectedPermissionIds(allIds)
    }   
    
    const handleSelectNone = () => {
        setSelectedPermissionIds([])
    }

    const permissionGroup = useMemo<IGruopPermissions>(() => {
        if (!permissions?.length) return {}
        const group: IGruopPermissions = {}
        permissions.forEach(permission => {
            const key = permission.canonical.split(':')[0]
            if (!group[key]) {
                group[key] = {
                    title: getModulePermissions(permission.canonical),
                    permissions: []
                }
            }
            group[key].permissions.push(permission)
        })
        return group
    }, [permissions])


    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setSelectedPermissionIds(prev => {
            if (checked) {
                if (prev.includes(permissionId)) return prev
                return [...prev, permissionId]
            }
            return prev.filter(item => item !== permissionId)
        })
    }

    const handleModulePermissionChange = (permissions: Permission[], checked: boolean) => {
        const ids = permissions.map(p => p.id)
        setSelectedPermissionIds(prev => {
            if (checked) {
                return Array.from(new Set([...prev, ...ids]))
            }
            return prev.filter(id => !ids.includes(id))
        })
    }

    useEffect(() => {
        if(isEdit && permissions?.length) {
            const currentPermissionIds = record?.permissions?.map(permission => permission.id) || []
            setSelectedPermissionIds(currentPermissionIds)
        }
    }, [permissions, record?.permissions])
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageConfig.heading} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl page-wrapper">
                <CusTomPageHeading
                    heading={pageConfig.heading}
                    breadcrumbs={breadcrumbs}
                />

                <div className='page-container'>
                    <div className='grid grid-cols-12 gap-4'>
                        <div className='col-span-5'>
                            <CustomNotice/>
                        </div>
                        <div className='col-span-7'>
                            <Form
                                // options={{
                                //     preserveScroll: true,
                                //     preserveState: false
                                // }}
                                method="post"
                                action={
                                    isEdit ? user_catalogue.update(record?.id).url : user_catalogue.store().url
                                }
                                resetOnSuccess={[]}
                                onSuccess={() => {
                                    setSelectedPermissionIds([])
                                }}
                                transform={(data) => (
                                    {
                                        ...data, 
                                        ...(isEdit ? { _method: 'put' } : {}),
                                        save_and_redirect: submitType === 'save_and_redirect',
                                        permissions: selectedPermissionIds,
                                    })}
                            >
                            {({ processing, errors }) => (
                                <>
                                    <CustomCard
                                        loading={false}
                                        title="Thông tin chung"
                                        description="Nhập đầy đủ các thông tin dưới đây"
                                        isShowHeader={true}
                                    >
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='col-span-1'>
                                                <Label htmlFor="" className='mb-[10px]'>Tên nhóm thành viên</Label>
                                                <Input
                                                    key={record?.updated_at}
                                                    id="name"
                                                    type="text"
                                                    name="name"
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    defaultValue={record?.name ?? ''}
                                                    placeholder=""
                                                />
                                                <InputError message={errors.name} className='mt-[5px]'/>
                                            </div>
                                            <div className='col-span-1'>
                                                <Label htmlFor="" className='mb-[10px]'>Từ khoá</Label>
                                                <Input
                                                    key={record?.updated_at}
                                                    id="canonical"
                                                    type="text"
                                                    name="canonical"
                                                    tabIndex={1}
                                                    autoComplete="canonical"
                                                    defaultValue={record?.canonical ?? ''}
                                                    placeholder=""
                                                />
                                            <InputError message={errors.canonical} className='mt-[5px]' />
                                        </div>
                                        </div>
                                        <div className='mt-[20px]'>
                                            <Label htmlFor="description" className='mb-[10px]'>Mô tả ngắn</Label>
                                            <Textarea
                                                name="description"
                                                id="description"
                                                className= 'h-[168px]'
                                                tabIndex={1}
                                                defaultValue={record?.description}
                                                placeholder="Nhập mô tả ngắn"   
                                            />
                                        </div>
                                    </CustomCard>

                                    <CustomCard
                                        loading={false}
                                        title="Quyền thành viên"
                                        description="Vui lòng chọn quyền thành viên dưới đây, chọn ít nhất 1 quyền"
                                        isShowHeader={true}
                                        className="bg-white rounded-[10px] shadow-sm border border-gray-200"
                                    >
                                        <div className='flex items-center justify-between'>
                                            <div className='text-blue-600'>Đã chọn: <span>{permissionCount.selected}</span>/ <span>{permissionCount.total}</span> quyền</div>
                                            <div className='flex items-center'>
                                                <Button 
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className='mr-[10px] cursor-pointer bg-[#0088ff] hover:bg-[#0088ff]/80 text-white'
                                                    onClick={handleSelectAll}
                                                >
                                                    Chọn tất cả
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleSelectNone}
                                                >
                                                    Bỏ chọn tất cả
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <ScrollArea className="h-[500px] pr-[10px]">
                                                <Accordion 
                                                    type="multiple" 
                                                    className="w-full space-y-3"
                                                    defaultValue={['item-1']}
                                                >
                                                    {Object.entries(permissionGroup).map(([moduleKey, module]) => (
                                                        <AccordionItem 
                                                            key={moduleKey}
                                                            value={`moduleKey-${moduleKey}`}
                                                            className="border rounded-xl bg-gray-50 shadow-sm overflow-hidden"
                                                        >
                                                            <div className="flex items-center gap-3 px-4 py-3">
                                                                <Checkbox 
                                                                    id={`moduleKey-${moduleKey}`}
                                                                    className="cursor-pointer" 
                                                                    checked={module.permissions.every(permission => permission.id && selectedPermissionIds.includes(permission.id))}
                                                                    onCheckedChange={(checked) => {handleModulePermissionChange(module.permissions, checked === true)}}
                                                                />
                                                                <AccordionTrigger className="flex-1 p-0 hover:no-underline">
                                                                    <Label 
                                                                        htmlFor={`moduleKey-${moduleKey}`}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        {module.title}
                                                                    </Label>
                                                                </AccordionTrigger>
                                                            </div>
                                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                                <div className="grid grid-cols-3 gap-3">
                                                                  {module.permissions.map(permission => (
                                                                        <label 
                                                                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-md" 
                                                                            key={permission.id}
                                                                            htmlFor={`permission-${permission.id}`}
                                                                        >
                                                                            <Checkbox 
                                                                                id={`permission-${permission.id}`}
                                                                                name="permissions[]" 
                                                                                value={permission.id} 
                                                                                className="cursor-pointer"
                                                                                checked={selectedPermissionIds.includes(permission.id)}
                                                                                onCheckedChange={(checked) => {handlePermissionChange(permission.id, checked === true)}}
                                                                            />
                                                                            <span className="text-sm text-gray-700">{permission.name}</span>
                                                                    </label>
                                                                  ))}

                                                                </div>
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    ))}
                                                </Accordion>
                                            </ScrollArea>
                                        </div>
                                    </CustomCard>

                                    <div className='mt-[10px]'>
                                        <div className="flex space-x-2">
                                            <Button
                                                type="submit"
                                                className="mt-4 w-[150px] cursor-pointer"
                                                tabIndex={4}
                                                disabled={processing}
                                                onClick={() => setSubmitType('')}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                                )}
                                                Lưu Lại
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="mt-4 w-[150px] cursor-pointer bg-blue-500"
                                                tabIndex={4}
                                                disabled={processing}
                                                onClick={() => setSubmitType('save_and_redirect')}
                                            
                                            >
                                                {processing && (
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                                )}
                                                Lưu Lại và đóng
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


           
