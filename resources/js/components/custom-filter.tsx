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
import { useState } from "react"
interface ICusTomFilterProps {
    filters : IFilter[] | undefined
}

const CusTomFilter = ({filters}: ICusTomFilterProps) => {
    // const { request } = usePage().props as {request?: Record<string, string>}
    const [mutiValues, setMutiValues] = useState<Record<string, string[]>>({})

    const handleMultiFiterChange = (key: string, values: string[]) =>{
        setMutiValues((prev) => ({
            ...prev,
            [key]: values
        }))
    }

    return (
        <Form
            method="get"
            action=""
            options={{
                preserveScroll: true,
                // preserveState: true
            }}   
            transform={(data) => ({
                    ...data,
                    ...mutiValues
            })}
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
                                options={filter.options ?? []}
                                onValueChange={(values) => handleMultiFiterChange(filter.key, values)}
                                defaultValue={mutiValues[filter.key] ?? []}
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
