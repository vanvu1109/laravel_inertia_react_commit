import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CustomConfirmDialog from "./custom-confirm-dialog"
import { useState } from "react"
import { sleep } from "@/lib/helper"
import { router } from "@inertiajs/react"

export type TBulkAction = {
  label?: string,
  confirm? : boolean,
  conFirmTitle?: string,
  conFirmDescription?: string,
  run: (ids: number[], module: string) => Promise<void> | void
}

const defaultActions :TBulkAction[] = [
  {
    label: 'Xoá nhiều bảng ghi',
    conFirmTitle: 'Bạn có chắc chắn muốn xoá bản ghi này',
    confirm: true,
    conFirmDescription: 'Lưu ý: Hành động này là không thể đảo ngược, hãy chắc chắn bạn muốn thực hiện hành động này',
    run: async (ids: number[], module: string) => {
      
      if(ids.length) {
        router.delete(`${module}`, {
          data: {ids},
          only: ['records', 'flash'],  
          preserveScroll: true,
          preserveState: true
        });
        // await sleep(3000)
      }    
    }
  },
  {
    label: 'Cập nhật trạng thái: Bật',
    run: (ids: number[], module: string) => {
      
      if(ids.length) {
      router.patch(`${module}`, {
        ids: ids,
        publish: 2
      },
        {
          only: ['records', 'flash'],  
          preserveScroll: true,
          preserveState: true
        }
      );
      }  
    }
  },
  {
    label: 'Cập nhật trạng thái: Tắt',
    run: (ids: number[], module: string) => {
      
      if(ids.length) {
      router.patch(`${module}`, {
        ids: ids,
        publish: 1
      },
        {
          only: ['records', 'flash'],  
          preserveScroll: true,
          preserveState: true
        }
      );
      }  
    }
  }
]


interface ICustomBulkActionProps {
  className?: string,
  selectedIds: number[]
  actions?: TBulkAction[],
  module: string | undefined,
  setSelectedIds: (ids: number[]) => void
}
const CustomBulkAction = ({
  className,
  selectedIds,
  actions,
  module,
  setSelectedIds
}: ICustomBulkActionProps) => {

  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [pendingAction, setPendingAction] = useState<TBulkAction | null>(null)
  const [processing, setProcessing] = useState<boolean>(false)

  const mergeActionsIndex = [...defaultActions, ...(actions ?? [])]
  
  const handleAction = (index : string) => {
    const action = mergeActionsIndex[Number(index)]

    if(!action) {
      return
    }

    if(action.confirm){
      setOpenDialog(true)
      setPendingAction(action)
    }else {
      action.run(selectedIds, module ?? '') 
      setProcessing(false)
      setSelectedIds([])
    } 
  }

  const handleConfirm = async () => {

    if(!pendingAction) {
      return
    }

    try{
      setProcessing(true)
      await pendingAction.run(selectedIds, module ?? '')
      setOpenDialog(false)
      setSelectedIds([])
    }finally{
      setOpenDialog(false)  
    }
  }

  return (

    <div className={`${className ? className : ''}`}>
      <Select 
        onValueChange={handleAction}
        >
        <SelectTrigger className={`mr-[10px] rounded-[5px] cursor-pointer ${className ? className : ''}`}>
            <SelectValue placeholder="Chọn tác vụ"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
              {mergeActionsIndex.map((option, index) => (
                  <SelectItem key={index} value={String(index)}>
                      {option.label}
                  </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
      </Select>

      {pendingAction &&(
        <CustomConfirmDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          description={pendingAction.conFirmDescription}
          title={pendingAction.conFirmTitle}
          processing={processing}
          onConFirm={handleConfirm}
        />
      )}
    </div>
)

}
export default CustomBulkAction
