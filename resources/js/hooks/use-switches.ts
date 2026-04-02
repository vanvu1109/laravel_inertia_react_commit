import type { PageConfig } from "@/types"
import { router } from "@inertiajs/react"
import { useCallback, useState } from "react"
interface IUseSwitch<T>{
    module: string | undefined,
    switchFields : NonNullable<PageConfig<T>['switches']> 
}

export type SwitchState<F extends string> = Record<
    string | number,
    {
        values: Partial<Record<F, string>>;
        loading: boolean;
    }
>
const useSwitch = <T>({
    module,
    switchFields
}: IUseSwitch<T>) => {

    type SwitchField = typeof switchFields[number]

    const [switches, setSwitches] = useState<SwitchState<SwitchField>>({});


    const handleSwitchChange = useCallback((id: number, field: SwitchField, curentValue: string) => () => {
        const newValue = curentValue === "2" ? "1" : "2";

        setSwitches((prev) => ({
            ...prev,
            [id]: {
                values: {...prev[id]?.values, [field]: newValue},
                loading : true
            }
        }));

        router.patch(`${module}/${id}/toggle/${field}`, {
            field: field,
            value: newValue,
        },{
            headers: {
                Accept: 'application/json' 
            },
            preserveScroll: true,
            preserveState: true,
            only : ['records', 'flash'],
            onError : () => {
                const fallbackValue = curentValue === "2" ? "2" : "1";
                setSwitches((prev) => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        [field]: fallbackValue,
                    },
                }));
            },
            onFinish : () => setSwitches((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    loading : false
                },
            }))
        });
    }, [module]);

    return {
        switches,
        setSwitches,
        module,
        switchFields,
        handleSwitchChange
    }
}

export default useSwitch


// {
//     id : {'publish' : 1 , 'is_highlight' : 2}
//     id : {'publish' : 1 , 'is_highlight' : 2}
// }