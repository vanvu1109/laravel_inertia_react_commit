import useSwitch from "./use-switches"
import type { PageConfig } from "@/types"
import { useCallback, useMemo, useState } from "react"
interface IUseTableProps<T> {
    pageConfig: PageConfig<T>,
    rerords: T[]
}
const useTable = <T extends {id: number}>({
    pageConfig,
    rerords
}: IUseTableProps<T>) => {

    const {switches, handleSwitchChange } = useSwitch<T>({module: pageConfig.module, switchFields: pageConfig.switches!})
    const [selectedIds, setSelectedIds] = useState<number[]>([])


    const handleCheckAll = (checked: boolean) => {
        if(checked) {
            setSelectedIds(rerords.map(item => item.id))
        } else {
            setSelectedIds([])
        }
    }

    const isAllChecked = useMemo((
        () => rerords.length > 0 && selectedIds.length === rerords.length
    ),[selectedIds, rerords])

    const handelCheckItem = useCallback(( id: number, checked: boolean) => {
        if(checked) {
            setSelectedIds((prev) => [...prev, id])
        } else {
            setSelectedIds((prev) => prev.filter(item => item !== id))
        }
    },[])

    return {
        switches,
        handleSwitchChange,
        selectedIds,
        setSelectedIds,
        handleCheckAll,
        isAllChecked,
        handelCheckItem
    } 
}

export default useTable
