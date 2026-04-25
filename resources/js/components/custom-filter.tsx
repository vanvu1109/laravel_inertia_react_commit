import type { IFilter } from "@/types"
import { Form, usePage } from "@inertiajs/react"
import user_catalogue from "@/routes/user_catalogue"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Search } from "lucide-react"
import { LoaderCircle } from "lucide-react"
// import {usePage} from "@inertiajs/react"
import {MultiSelect} from "./custom-multiple-select"
import { useEffect, useState } from "react"
import {FormDataConvertible} from '@inertiajs/core'
import { filter } from "@/constants/filter"
interface ICusTomFilterProps {
    filters : IFilter[] | undefined
}

const CusTomFilter = ({filters}: ICusTomFilterProps) => {
    const { request } = usePage().props as {request?: Record<string, string>}
    const [mutiValues, setMutiValues] = useState<Record<string, string[]>>({})

    const handleMultiFiterChange = (key: string, values: string[]) =>{
        console.log(key,values);
        setMutiValues((prev) => {
            const updated = {...prev}
            if(values.length === 0){
                delete updated[key]
            }else{
                updated[key] = values
            }
            return updated
        })
    }

    useEffect(() => {
        if (!filters || !request) return
        const initValue: Record<string, string[]> = {}
        filters.forEach((filter) => {
            if (filter.type !== 'multiple') return
            const fieldData = request[filter.key]
            // check object dạng { in: "1,2" }
            if (typeof fieldData === 'object' && fieldData !== null) {
                //ví dụ request.user_catalogues = {id : { between : 1,2}}
                const nestedFieldKey = Object.keys(fieldData)[0]
                const nestedData = fieldData[nestedFieldKey]
                if (typeof nestedData === 'object') {
                    const operator = Object.keys(nestedData)[0]
                    const rawData = nestedData[operator]
                    // console.log(operator,nestedData);
                    if(rawData){
                        initValue[filter.key] = ( rawData as string ).split(',')
                    }
                }
            }
        })
        setMutiValues(initValue)
    }, [filters, request])

    return (
        <Form
            method="get"
            action=""
            options={{
                preserveScroll: true,
                // preserveState: true
            }}   
            transform={(data) => {
                const transformed: Record<string, FormDataConvertible> = {}
                // chỉ giữ field có giá trị
                Object.keys(data).forEach((key) => {
                    const value = data[key]
                    if (value !== '' && value !== null && value !== undefined) {
                        transformed[key] = value
                    }
                })
                // xử lý multi filter
                filters?.forEach(filter => {
                    const key = filter.key
                    const values = mutiValues[key] ?? []

                    if(values.length){
                        let operator = filter.operator
                        let field = filter.field
                        if(!operator){
                            if(values.length === 1) operator = 'equal'
                            else if (values.length >= 2) operator = 'in'
                        }
                        transformed[`${key}[${field}][${operator}]`] = values.join(',')
                    }
                })
                return transformed
            }}
            >
            {({ processing }) => (
                <div className="flex items-center justify-between mr-[10px]">
                    {filters && filters.map(filter => 
                        filter.type === 'single' ? (
                            <Select name={filter.key} key={filter.key}>
                                <SelectTrigger className="w-[220px] rounded-[5px] cursor-pointer mr-[10px]">
                                    <SelectValue placeholder={filter.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {filter.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        ): (
                            <MultiSelect
                                key={filter.key}
                                options={filter.options ?? []}
                                onValueChange={(values) => handleMultiFiterChange(filter.key, values)}
                                value={mutiValues[filter.key] ?? []}
                                variant="inverted"
                                name={filter.key}
                                maxWidth='400px'
                                className='rounded-[5px] cursor-pointer mr-[10px]'
                                placeholder="Chọn nhóm thành viên"
                            />
                        )
                    )}
                    <Input 
                        type="text" 
                        placeholder="Nhập từ khoá tại đây"
                        className="w-[220px] rounded-[5px] cursor-pointer mr-[10px]" 
                        name="keyword"
                    />
                    <Button className="rounded-[5px] cursor-pointer bg-[#0088ff] hover:bg-[#0088ff]/80 text-white flex items-center justify-center">
                        {processing ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Search className="h-4 w-4"/>}
                        <span>Tìm kiếm</span>
                    </Button>
                </div>
              ) 
            }
        </Form>
    )
}

export default CusTomFilter
