import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, IDateTime, PageConfig, User } from '@/types';
import  CusTomPageHeading from '@/components/custom-page-heading';
import CustomCard from '@/components/custom-card';
// import CustomNotice from '@/components/custom-notice';
import { Form } from '@inertiajs/react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import InputError from '@/components/input-error';
// import { Button } from '@/components/ui/button';
// import  { LoaderCircle } from 'lucide-react';
import post_catalogue from '@/routes/post_catalogue';
// import {Textarea} from '@/components/ui/textarea';
import { useRef, useState } from 'react';
import { Editor } from '@/components/editor';
import Seo from '@/components/custom-seo';
import CustomGeneral from '@/components/custom-general';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { FormProvider } from '@/context/FormContext';
import CustomAlbum  from '@/components/custom-album';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Thêm mới bài viết',
        href: '/backend/post_catalogue/create',
    },
];

const pageConfig:PageConfig<PostCatalogue> = {
    heading: 'Quản Lý Bài Viết',
}

export interface PostCatalogue extends IDateTime{
    id: number,
    name: string,
    publish: string,
    content: string,
    description: string,
    canonical: string,
    album: string[],
    creators: User
}

interface PostSaveProps {
    record?: PostCatalogue;
}

export default function PostSave({ record }:PostSaveProps) {

    const button = useRef('')

    const isEdit = !!record?.id

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageConfig.heading} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl page-wrapper">
                <CusTomPageHeading
                    heading={pageConfig.heading}
                    breadcrumbs={breadcrumbs}
                />

                <div className='page-container'>
                   <FormProvider> 
                        <Form
                            // options={{
                            //     preserveScroll: true,
                            //     preserveState: false 
                            // }}
                            key={JSON.stringify(record)}
                            method="post"
                            action={
                                isEdit ? post_catalogue.update(record?.id).url : post_catalogue.store().url
                            }
                            resetOnSuccess = {['name', 'canonical', 'description']}
                            transform={(data) => (
                                {
                                    ...data, 
                                    ...(isEdit ? { _method: 'put' } : {}),
                                    save_and_redirect: button.current
                                })}
                        >
                        {({ processing, errors }) => (
                            <>
                                <div className=' mr-auto ml-auto '>
                                    <div className='grid grid-cols-12 gap-4'>
                                        <div className='col-span-9'>
                                            <CustomGeneral
                                                name={record?.name}
                                                isShowContent
                                                isShowDescription
                                                content={record?.content}
                                                errors={errors}
                                                className='mb-[20px]'
                                            />
                                            <CustomAlbum/>
                                            <Seo 
                                                record={record}
                                                errors={errors}
                                            />
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
                                        </div>
                                        <div className='col-span-3'>
                                            <CustomCard
                                                loading={false}
                                                title="Danh mục cha"
                                                description="Nhập đầy đủ các thông tin"
                                                isShowHeader={true}
                                            >
                                                123
                                            </CustomCard>
                                        </div>
                                    </div>
                                </div>                 
                                
                            </>
                        )}
                        </Form>
                   </FormProvider> 
                </div>
            </div>
        </AppLayout>
    )
}

           
