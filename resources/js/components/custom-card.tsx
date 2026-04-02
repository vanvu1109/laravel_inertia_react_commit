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
}


const CustomCard = ({
    loading,
    title,
    description,
    height,
    isShowHeader,
    isShowFooter,
    children,
    footerChildren
}: ICustomCardProps) => {
  return (
    <Card className="relative rounded-[5px] gap-4 pt-[20px]">
        {isShowHeader && (
            <CardHeader className="border-b">
                <CardTitle className="text-[18px] uppercase">{title}</CardTitle>
                <CardDescription className="pb-[20px] text-[16px]">{description}</CardDescription>
            </CardHeader>
        )}
        <CardContent className={`px-[10px] ${height ?? ''}`}>
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
