import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, PageConfig, User } from '@/types';
import  CusTomPageHeading from '@/components/custom-page-heading';
import CustomCard from '@/components/custom-card';
import CustomNotice from '@/components/custom-notice';
import { Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import  { LoaderCircle } from 'lucide-react';
import user from '@/routes/user';
import {Textarea} from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import CustomDatePicker  from '@/components/custom-date-picker';
import { useFormDataEmitter } from '@/hooks/use-form-data-emitter';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Thêm mới Thành viên',
        href: '/backend/user/create',
    },
];

const pageConfig:PageConfig<User> = {
    heading: 'Quản Lý Thành viên',
}

interface UserSaveProps {
    record?: User;
}

export default function UserSave({ record }:UserSaveProps) {

    const button = useRef('')
    const isEdit = !!record?.id
     
    const {
        formDataEmiiter,
        handleEmitterChange
    } = useFormDataEmitter();

    useEffect(() => {
        console.log(formDataEmiiter)
    }, [formDataEmiiter])
    
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
                                key={JSON.stringify(record)}
                                method="post"
                                action={
                                    isEdit ? user.update(record?.id).url : user.store().url
                                }
                                resetOnSuccess = {['name', 'canonical', 'description']}
                                transform={(data) => (
                                    {
                                        ...data, 
                                        ...formDataEmiiter,
                                        ...(isEdit ? { _method: 'put' } : {}),
                                        save_and_redirect: button.current
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
                                        <div className='grid grid-cols-2 gap-4 mb-[10px]'>
                                            <div className='col-span-1'>
                                                <Label htmlFor="" className='mb-[10px]'>Tên thành viên</Label>
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
                                                <Label htmlFor="" className='mb-[10px]'>Email</Label>
                                                <Input
                                                    key={record?.updated_at}
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    defaultValue={record?.email ?? ''}
                                                    placeholder=""
                                                />
                                                <InputError message={errors.email} className='mt-[5px]'/>
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-2 gap-4 mb-[10px]'>
                                            <div className='col-span-1'>
                                                <Label htmlFor="" className='mb-[10px]'>Địa chỉ</Label>
                                                <Input
                                                    key={record?.updated_at}
                                                    id="address"
                                                    type="text"
                                                    name="address"
                                                    autoFocus
                                                    tabIndex={1}
                                                    defaultValue={record?.address ?? ''}
                                                    placeholder=""
                                                />
                                                <InputError message={errors.address} className='mt-[5px]'/>
                                            </div>
                                            <div className='col-span-1'>
                                               <div className='flex flex-col'>
                                                    <Label htmlFor="" className='mb-[10px]'>Ngày sinh</Label>
                                                    <CustomDatePicker
                                                        title="Ngày sinh"
                                                        name="birthday"   
                                                        defaultValue={record?.birthday ?? ''}
                                                        onChange={handleEmitterChange}
                                                    />
                                               </div>
                                                <InputError message={errors.birthday} className='mt-[5px]'/>
                                            </div>
                                        </div>
                                        <div className='mt-[10px]'>
                                            <div className="flex space-x-2">
                                                <Button
                                                type="submit"
                                                className="mt-4 w-[150px] cursor-pointer"
                                                tabIndex={4}
                                                disabled={processing}
                                                onClick={() => button.current = ''}
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
                                                onClick={() => button.current = 'save_and_redirect'}
                                                
                                                >
                                                    {processing && (
                                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                                    )}
                                                    Lưu Lại và đóng
                                                </Button>
                                            </div>
                                       </div>
                                    </CustomCard>
                                </>
                            )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

           
