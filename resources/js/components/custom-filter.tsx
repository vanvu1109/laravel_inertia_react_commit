import type { IFilter } from "@/types"
import { Form } from "@inertiajs/react"
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

interface ICusTomFilterProps {
    filters : IFilter[] | undefined
}

const CusTomFilter = ({filters}: ICusTomFilterProps) => {
    // const { request} = usePage().props as { request?: Record<string, string>}

    return (
        <Form
            method="get"
            action=""
            options={{
                preserveScroll: true,
                // preserveState: true
            }}   
        >
            {({ processing }) => (
                <div className="flex items-center justify-between mr-[10px]">
                    {filters && filters.map(filter => (
                        <Select 
                            key={filter.key}
                            // onValueChange={}
                            defaultValue={filter.defaultValue ?? ''}
                            name={filter.key}
                        >
                            <SelectTrigger className={`mr-[10px] rounded-[5px] cursor-pointer ${filter.className ? filter.className : ''}`}>
                                <SelectValue placeholder={filter.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {filter.options?.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ))}
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
