import { values } from "lodash";
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, } from "react";

interface FormProviderProps{
    children: React.ReactNode
    initData?: {
        name: string,
        meta_title: string

    }
}

interface IFormContext {
    name: string, 
    setName: Dispatch<SetStateAction<string>>,
    metaTitle: string,
    setMetaTitile: Dispatch<SetStateAction<string>>,
    displayMetaTitle: string
}

const FormContext = createContext<IFormContext | null>(null);

export function FormProvider({
    children,   
    initData,
}: FormProviderProps) {

    const [name, setName] = useState<string>(initData?.name || "")
    const [metaTitle, setMetaTitile] = useState<string>(initData?.meta_title || "")

    useEffect(()=> {
        if(initData?.name !== undefined) setName(initData?.name)
        if(initData?.meta_title !== undefined) setMetaTitile(initData?.meta_title)
    },[initData?.meta_title, initData?.name])

    const displayMetaTitle = metaTitle || name

    return (
        <FormContext.Provider
            value = {
                {
                    name,
                    setName,
                    metaTitle,
                    setMetaTitile,
                    displayMetaTitle
                }
            }
        >
            {children}
        </FormContext.Provider>
    )
}

export const useFormContext = (): IFormContext => {
    const context = useContext(FormContext)
    if(!context) {
        throw new Error("")
    }
    return context
}