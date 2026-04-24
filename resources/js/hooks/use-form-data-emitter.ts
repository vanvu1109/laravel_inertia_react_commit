import { useState } from "react";

type Emitter = string | null | string[] | number[];
export const useFormDataEmitter = () => {
    const [formDataEmiiter, setFormDataEmitter] = useState<Record<string, Emitter>>({});
    
    const handleEmitterChange = (name: string, value: Emitter) =>{
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