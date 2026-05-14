import { useEffect, useState } from "react"
import CustomCard from "./custom-card"
import { CardHeader, CardTitle } from "./ui/card"
import { CirclePlus } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
interface ICustomAlbumProps {
    data?: string[],
    onChange?: (files: File[]) => void
}

const IMagesItem = React.memo(({
    src,
    onRemove,
}: {
    src: string,
    onRemove?: () => void,
}) => {

    return (

        <div className="relative group rounded-[5px] overflow-hidden border border-gray-200 hover:shadow-md transition">
        <img
            src={src}
            className="object-cover w-full h-[150px]"
        />

        <Button
            onClick={onRemove}
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
            <Trash2 size={3} />
        </Button>
    </div>
    )
})

export default function CustomAlbum({ data, onChange }: ICustomAlbumProps){

    const [files, setFiles] = useState<File[]>([])
    const [preview, setPreview] = useState<string[]>(data || [])

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
        if (!selectedFiles) return

        const fileArray = Array.from(selectedFiles)

        const newFiles = [...files, ...fileArray]

        setFiles(newFiles)

        const previewUrls = fileArray.map(file => URL.createObjectURL(file))
        setPreview(prev => [...prev, ...previewUrls])
        onChange?.(newFiles)
    }

    const removeImage = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        const newPreview = preview.filter((_, i) => i !== index)

        setFiles(newFiles)
        setPreview(newPreview)

        onChange?.(newFiles)
    }

    return (
        <CustomCard
            isShowHeader
            title="Album hình ảnh"
            headerChildren={
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between mb-[20px]">
                        <CardTitle className="uppercase">Album hình ảnh</CardTitle>

                        {/* 👉 input hidden */}
                        <label className="cursor-pointer text-blue-500 flex items-center gap-1">
                            <CirclePlus/>
                            Thêm ảnh
                            <input
                                type="file"
                                multiple
                                name="images[]"
                                className="hidden"
                                onChange={handleUpload}
                            />
                        </label>
                    </div>
                </CardHeader>
            }
        >
            {preview.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                    {preview.map((src, index) => (
                        <IMagesItem
                            key={index}
                            src={src}
                            onRemove={() => removeImage(index)} 
                        />
                    ))}
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-[80px] h-[80px] text-yellow-400"
                    >
                        <path d="M16.88 9.94A5.5 5.5 0 0 0 6 11a4 4 0 0 0 0 8h3v-4H7l5-5 5 5h-2v4h1a4 4 0 0 0 .88-7.06Z" />
                    </svg>
                    <span>Click để upload</span>

                    <input
                        type="file"
                        multiple
                        name="images[]"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </label>
            )}
        </CustomCard>
    )
}