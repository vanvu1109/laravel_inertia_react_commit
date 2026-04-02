import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@inertiajs/react"
import { LoaderCircle } from "lucide-react"
import { useMemo } from "react"


interface ICustomConFirmDeleteProps {
    id: number,
    module: string | undefined,
    children: React.ReactNode
}

const CustomConFirmDelete = ({
    id,
    module,
    children
}: ICustomConFirmDeleteProps) => {

    const actionForm = useMemo(() => {
        return `${module}/${id}`
    }, [id, module])

    return (
                <>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        {children}
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <Form
                            method="post"
                            transform = {(data) => ({...data, _method: 'delete'})}
                            action={actionForm}
                        >
                            {({ processing }) => (
                                <>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Bạn có chắc chắn muốn xoá bảng ghi này?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    Lưu ý: Hành động này là không thể đảo ngược, hãy chắc chắn bạn muốn thục hiện hành động này.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel className="cursor-pointer">Huỷ</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button
                                            type="submit"
                                            className="w-[150px] cursor-pointer bg-red-400 hover:bg-red-600 text-white"
                                            tabIndex={4}
                                            disabled={processing}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/>
                                                )}
                                                Xác nhận và xoá
                                        </Button>
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </Form>
                    </AlertDialogContent>
                    </AlertDialog>      
                </>
    )
}

export default CustomConFirmDelete


