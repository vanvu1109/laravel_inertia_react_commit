import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"

export interface IColumn {
    key: string;
    label: React.ReactNode;
    className?: string;
}

interface ICustomTableProps<T> {
    columns: IColumn[] | undefined;
    data: T[];
    render: (item: T) => React.ReactNode;
}

const CustomTable = <T, >({ 
    data,
    columns,
    render
}: ICustomTableProps<T>) => {
  return (
    <div>
        <Table className="border rounded-[5px] mt-[30px]">
            <TableHeader className="bg-gray-200">
                <TableRow>
                    {columns && columns.map(col => (
                        <TableHead className={`${col.className ? col.className : 'w-[100px]'}`} key={col.key}>
                            {col.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
               {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={columns?.length} className="h-[50px] text-center text-sm text-red-600">
                            Không tìm thấy dữ liệu phù hợp
                        </TableCell>
                    </TableRow>
               ): (
                   data.map(item => render(item))
               )}
            </TableBody>
        </Table>
    </div>
  )
}

export default CustomTable;