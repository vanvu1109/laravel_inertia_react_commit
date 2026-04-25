import type { User } from '@/types'
import { useMemo } from 'react'
import { chooseAll } from '@/constants/filter'
import type { IFilter } from '@/types'
interface IUserFilter{
    users: User[],
    defaultFilters: IFilter[] | undefined
}
const useFilter = ({users, defaultFilters}: IUserFilter) => {

    const filters: IFilter[] = useMemo(() => {
        return [
            ...( defaultFilters ?? []),
            {
                key: 'user_id',
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
            }
        ]
    }, [users, defaultFilters])

    return {
        filters
    }
}

export default useFilter
