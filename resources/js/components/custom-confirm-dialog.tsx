import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoaderCircle } from "lucide-react"
import { Button } from "./ui/button"

interface ICustomConfirmDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void
    title: string | undefined, 
    description: string | undefined,
    onConFirm: () => void,
    processing?: boolean
}   

const CustomConfirmDialog = ({
    open,
    onOpenChange,
    title = 'Xác nhận hành động',
    description= 'Bạn có chắc chắn muốn thực hiện hành động này?',
    processing = false,
    onConFirm
}: ICustomConfirmDialogProps) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Huỷ</AlertDialogCancel>
                <AlertDialogAction asChild>
                    <Button
                        type="submit"
                        className="w-[150px] cursor-pointer bg-red-400 hover:bg-red-600 text-white"
                        tabIndex={4}
                        onClick={(e)=> {
                            e.preventDefault()
                            onConFirm()
                            // onOpenChange(false)
                        }}
                        disabled={processing}

                        >
                            {processing && (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                            )}
                            Xác nhận và xoá
                    </Button>
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>      
    )
}

export default CustomConfirmDialog