import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { JSX } from "react"

interface ICustomCardProps {
    loading?: boolean,
    title?: string,
    description?: string,
    height?: string
    isShowHeader?: boolean
    isShowFooter?: boolean
    children: React.ReactNode
    footerChildren?: JSX.Element
    className?: string
}


const CustomCard = ({
    loading,
    title,
    description,
    height,
    isShowHeader,
    isShowFooter,
    children,
    footerChildren,
    className
}: ICustomCardProps) => {
  return (
    <Card className={`relative rounded-[5px] gap-4 pt-[20px] ${className ? className : ''}`}>
        {isShowHeader && (
            <CardHeader className={`border-b ${!description ? 'gap-0 ' : null}`}>
                <CardTitle className="text-[18px] uppercase">{title}</CardTitle>
                <CardDescription className="pb-[20px] text-[16px]">{description ? description : ''}</CardDescription>
            </CardHeader>
        )}
        <CardContent className={`px-[20px] ${height ?? ''}`}>
           {children}
        </CardContent>
        {isShowFooter && (
            <CardFooter className="flex justify-center items-center">
                {footerChildren}
            </CardFooter>
        )}

        {loading && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/70 ">
            <Loader2 className="animate-spin size-8 text-muted-foreground"/>
        </div>
        )}
    </Card>
  )
}

export default CustomCard
