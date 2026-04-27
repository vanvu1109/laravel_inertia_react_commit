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
import language from '@/routes/language';
import {Textarea} from '@/components/ui/textarea';
import { useRef } from 'react';
import ImageUpload from '@/components/image-upload';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Thêm mới Ngôn ngữ',
        href: '/backend/language/create',
    },
];

const pageConfig:PageConfig<Language> = {
    heading: 'Quản Lý Ngôn ngữ',
}

export interface Language extends IDateTime{
    id: number,
    name: string,
    publish: string,
    description: string,
    canonical: string,
    frontend_default: string,
    backend_default: string,
    image: string,
    creators: User,
}

interface LanguageSaveProps {
    record?: Language;
}

export default function LanguageSave({ record }:LanguageSaveProps) {

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
                                encType="multipart/form-data"
                                action={
                                    isEdit ? language.update(record?.id).url : language.store().url
                                }
                                resetOnSuccess = {['name', 'canonical', 'description']}
                                transform={(data) => (
                                    {
                                        ...data, 
                                        ...(isEdit ? { _method: 'put' } : {} ),
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
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='col-span-1'>
                                                <Label htmlFor="" className='mb-[10px]'>Tên ngôn ngữ</Label>
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
                                                    defaultValue={record?.canonical ?? ''}
                                                    placeholder=""
                                                />
                                                <InputError message={errors.canonical} className='mt-[5px]'/>
                                            </div>
                                        </div>
                                        <div className='mt-[20px]'>
                                            <Label htmlFor="description" className='mb-[10px]'>Chọn ảnh</Label>
                                            <ImageUpload name="image" value={record?.image}/>
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

           
