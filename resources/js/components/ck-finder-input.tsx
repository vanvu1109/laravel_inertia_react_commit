import { use, useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ICKFinderProps{
    name: string;
    value?: string
}

export default function CkfinderInput({
    name,
    value
}:ICKFinderProps) {

    const [image, setImages] = useState<string>('')
    useEffect(()=> {
        if(value) setImages(value)
    },[value])

    useEffect(() => {
        const script = document.createElement("script")
        script.src = '/plugins/ckfinder/ckfinder.js'
        script.async = true
        script.onload = () => {
            console.log("Ckfinder Input Loaded");
        }

        document.body.appendChild(script)

        return () => {
            document.body.removeChild(script)
        }

    }, [])

    // ck-finder-input.tsx

const openFinder = () => {
    // Truy cập trực tiếp vào đối tượng CKFinder đã load từ script
    const CKFinder = (window as any).CKFinder;

    if (CKFinder) {
        CKFinder.modal({
            // QUAN TRỌNG: Chỉ định đường dẫn gốc để tránh lỗi 404 skin/js
            basePath: '/plugins/ckfinder/', 
            
            chooseFiles: true,
            width: 800,
            height: 600,
            resourceType: 'Images',
            onInit: function(finder: any) {
                // Sự kiện khi người dùng chọn file và nhấn "Select"
                finder.on('files:choose', function(evt: any) {
                    const file = evt.data.files.first();
                    const url = file.getUrl();
                    setImages(url);
                });

                // Sự kiện khi đóng cửa sổ
                finder.on('window:destroy', function() {
                    console.log("Cửa sổ CKFinder đã đóng");
                });
            }
        });
        } else {
            console.error("CKFinder chưa được tải. Hãy kiểm tra lại đường dẫn script.");
        }
    };

    return (
        <div className="w-full">
           <div className="flex gap-2">
                <Input
                    name={name}
                    type="" 
                    className="w-[800px]"
                    value={image}
                    readOnly
                    id={name}
                />
                <input
                    type="hidden"
                    name={name}
                    value={image}
                />

                <div className="flex-[2_2_0%]">
                    <Button onClick={openFinder} type="button" variant="outline" className="w-full whitespace-nowrap">
                        Click để chọn ảnh
                    </Button>
                </div>
            </div>
        </div>
    )
}