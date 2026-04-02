import type { User } from '@/types'
import { useMemo } from 'react'
import { chooseAll } from '@/constants/filter'
import type { PageConfig } from '@/types'
import type { IFilter } from '@/types'
interface IUserFilter{
    users: User[],
    pageConfig: PageConfig
}
const useFilter = ({users, pageConfig}: IUserFilter) => {

    const filters: IFilter[] | undefined= useMemo(() => {
        return [
            ...( pageConfig.filters ?? []),
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
                className : 'w-[180px]'
            }
        ]
    }, [users, pageConfig.filters])

    return {
        filters
    }
}

export default useFilter
