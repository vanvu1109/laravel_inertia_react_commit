import CustomCard from "./custom-card"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from "./input-error";
import {Textarea} from '@/components/ui/textarea';
import { usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import { useFormContext } from "@/context/FormContext";
import { useEffect, useState } from "react";
import { toSlug } from "@/lib/helper";

type TSeoBase = {
    meta_title?: string;
    meta_description?: string;
    canonical: string;
    name?: string
}

interface ISeoProps<T>{
    record? : T | undefined
    errors?: Record<string, string>
}

const SUFFIX= '.html'
const META_TILTLE_LIMIT = 71
const META_DESCRIPTION_LIMIT = 300
export default function Seo<T extends TSeoBase>({
    record,
    errors
}:ISeoProps<T>) {
    const { app } = usePage<SharedData>().props
    const {setMetaTitile, displayMetaTitle, name} = useFormContext()

    const [canonical, setCanonical] = useState<string>(record?.canonical || toSlug(name) || '')
    const displayCannonical = canonical ? toSlug(canonical) : toSlug(name)
    const [metaDescription, setMetaDescription] = useState<string>(record?.meta_description || '')

    const metaTitleLengt = displayMetaTitle.length
    const metaDescriptionLenght = metaDescription.length
    const metaTitleOver = metaTitleLengt > META_TILTLE_LIMIT
    const metaDescriptionOver = metaDescriptionLenght > META_DESCRIPTION_LIMIT
 
    return (
        <CustomCard
            isShowHeader={true}
            title="Cấu Hình Seo"
            className="mt-[20px]"
            description="Nhập dầy đủ thông tin dưới đây"
        > 

            <div className="mb-[20px]">
                <div className="seo-preview bg-blue-400/35 p-[10px] mb-[20px]">
                    <div className="text-blue-500 mb-[10px] text-[18px]">{displayMetaTitle || 'Bạn chưa nhập tiêu đề để SEO'}</div>
                    <div className="text-green-500 mb-[10px] text-[16px]">{app.url}/{toSlug(displayCannonical)}{SUFFIX}</div>
                    <div className="text-gray-700 mb-[10px] text-[16px]">{metaDescription}</div>
                </div>

                <div className='grid grid-cols-1 gap-4 mb-[20px]'>
                    <div className='col-span-1'>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="" className='mb-[10px]'>Tiêu đề</Label>
                            <span className={`text-[14px] ${metaTitleOver ? 'text-red-500' : ''}`}><span>{metaTitleLengt}</span>/{META_TILTLE_LIMIT}</span>
                        </div>
                        <Input
                            id="mata_title"
                            type="text"
                            name="meta_title"
                            autoFocus
                            tabIndex={1}
                            defaultValue={record?.meta_title ?? ''}
                            onChange={(e) => setMetaTitile(e.target.value)}
                        />
                        {errors && (
                            <InputError message={errors.name} className='mt-[5px]'/>
                        )}
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-4 mb-[20px]'>
                    <div className='col-span-1'>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="" className='mb-[10px]'>Mô tả SEO</Label>
                            <span className={`text-[14px] ${metaDescriptionOver ? 'text-red-500' : ''}`}><span>{metaDescriptionLenght}</span>/{META_DESCRIPTION_LIMIT}</span>
                        </div>
                        <Textarea
                            name="meta_description"
                            id="meta_description"
                            className= 'h-[168px] w-full '
                            tabIndex={1}
                            defaultValue={record?.meta_description}
                            onChange={(e) => setMetaDescription(e.target.value)}
                        />
                        {errors && (
                            <InputError message={errors.meta_description} className='mt-[5px]'/>
                        )}
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-4 mb-[20px]'>
                    <div className='col-span-1'>
                        <div className="flex justify-between items-center">
                            <Label htmlFor="canonical" className='mb-[10px]'>Đường dẫn</Label>
                            {/* <span className="text-[14px]"><span>0</span>/300</span> */}
                        </div>
                        <div className="relative">
                            <span className="base-url">{app.url}</span>
                            <Input
                                id="canonical"  
                                type="canonical"
                                name="canonical"
                                defaultValue={displayCannonical}
                                className="pl-[150px]"
                                onChange={(e) => setCanonical(e.target.value)}
                            />                    
                        </div>
                        {errors && (
                            <InputError message={errors.canonical} className='mt-[5px]'/>
                        )}
                    </div>
                </div>
            </div>
        </CustomCard>
  )
}