import CustomCard from "./custom-card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import InputError from "./input-error"
import { Editor } from "./editor"
import { useFormContext } from "@/context/FormContext"
interface ICustomGeneralProps {
    name?: string,
    content?: string
    description?: string
    errors?: Record<string,string> | undefined
    isShowContent?: boolean,
    isShowDescription?: boolean,
    className: string
}

export default function CustomGeneral({
    name,   
    content,
    description,
    errors,
    isShowContent,
    isShowDescription,
className
}: ICustomGeneralProps){
    const { setName} = useFormContext()

    return (
        <CustomCard
            loading={false}
            title="Thông tin chung"
            description="Nhập đầy đủ các thông tin dưới đây"
            isShowHeader={true}
            className={className}
        >
            <div className='grid grid-cols-1 gap-4'>
                <div className='col-span-1'>
                    <Label htmlFor="name" className='mb-[10px]'>Tiêu đề</Label>
                    <Input
                        // key={record?.updated_at}
                        id="name"
                        type="text"
                        name="name"
                        autoFocus
                        tabIndex={1}
                        autoComplete="name"
                        defaultValue={name ?? ''}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <InputError message={errors?.name} className='mt-[5px]'/>
                </div>
            </div>

            {isShowContent && (
                <div className='mt-[20px]'>
                    <Label htmlFor="content" className='mb-[10px]'>Nội dung</Label>
                    <Editor key="content" height="h-[300px]" name='content' value={content ?? ""}/>
                </div>
            )}

            {isShowDescription && (
                <div className='mt-[20px]'>
                    <Label htmlFor="description" className='mb-[10px]'>Mô tả</Label>
                    <Editor key="description" height="h-[300px]" name='description' value={description ?? ""}/>
                </div>       
            )}                           
        </CustomCard>
    )

}