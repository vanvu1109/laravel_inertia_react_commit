    import type { IFilter, ISelectOptionItem } from "@/types";


    export const publish: ISelectOptionItem[] = [
        {
            label : "Không hoạt động",
            value : "1"
        },
        {
            label : "Hoạt động",
            value : "2"
        },
    ]

    export const chooseAll = (label: string = 'Chọn tất cả') => {
        return { label : label, value : '0' }
    }

    const perpage = ['20', '30', '40', '50', '60', '70', '80', '90', '100']

    export const filter : IFilter[] = [
        {
            key : "perpage",
            placeholder : "Chọn số bảng ghi",
            defaultValue : "20",
            options : perpage.map((item) => ({
                label : `${item} bản ghi`, 
                value : item
            })),
            className: 'w-[180px]'
        },
        {
            key : "publish",
            placeholder : "Chọn trạng thái",
            defaultValue : "0",
            options : [
                {...chooseAll('Tất cả trạng thái')},
                ...publish
            ],
            className: 'w-[180px]'
        },
    ]