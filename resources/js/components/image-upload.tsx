import { useState, useEffect } from 'react';
import { Input } from './ui/input';

interface IUploadImageProps {
    name: string,
    value?: string
}

const ImageUpload = ({ name, value }: IUploadImageProps) => {

    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (value) {
            setPreview(`${window.location.origin}/storage/${value}`);
        }
    }, [value]);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        }
    };

    return (
        <div className="flex flex-col space-y-3">
            {preview && (
                <img 
                    src={preview} 
                    className="w-[150px] h-[100px] object-cover rounded border"
                />
            )}
            <Input 
                name={name}
                id={name}
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
            />
        </div>
    );
};

export default ImageUpload;