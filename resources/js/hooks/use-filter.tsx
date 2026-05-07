import type { User } from '@/types'
import { useMemo } from 'react'
import { chooseAll } from '@/constants/filter'
import type { IFilter } from '@/types'

interface IUserFilter{
    users: User[],
    defaultFilters: IFilter[] | undefined,
    isShowCreatorFilter?: boolean
}
const useFilter = ({
    users, 
    defaultFilters,
    isShowCreatorFilter = true
}: IUserFilter) => {

    const filters: IFilter[] = useMemo(() => {
        const baseFilter = [...(defaultFilters ?? [])]
        if(isShowCreatorFilter){
            baseFilter.push({
                key: 'created_by',
                placeholder : 'Chọn người tạo',
                options : [
                    {...chooseAll('Tất cả người tạo')},
                    ...users.map((user) => ({
                        label : user.name,
                        value : user.id.toString()
                    }))
                ],
                defaultValue : '0',
                className : 'w-[180px]',
                type : 'single',
            })
        }
        return [
            ...baseFilter
        ]
    }, [users, defaultFilters, isShowCreatorFilter])

    return {
        filters
    }
}

export default useFilter
