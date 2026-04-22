import { useState } from "react";

export const useFormDataEmitter = () => {
    const [formDataEmiiter, setFormDataEmitter] = useState<Record<string, string | null>>({});
    
    const handleEmitterChange = (name: string, value: string | null) =>{
        setFormDataEmitter((prev) => ({ 
            ...prev,
            [name]: value 
        }));
    }

    return {
        formDataEmiiter,
        handleEmitterChange
    };
};