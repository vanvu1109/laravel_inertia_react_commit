import { Link } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

interface ICustomPageHeadingProps {
    heading: string,
    breadcrumbs: BreadcrumbItem[]
}


const CustomPageHeading = ({
    heading,
    breadcrumbs
}: ICustomPageHeadingProps) => {
  return (
    <div className="border-b border-[#e7eaec] page-heading px-[20px] py-[30px] bg-[#fff]">
       <h2 className="font-semi uppercase text-[20px] mb-[5px]">{heading}</h2>
       <ol className="custom-breadcrumb flex flex-1 ">
            {breadcrumbs.map((item, index) => (
               <li key={index}><Link href={item.href}>{item.title}</Link></li>
            ))}
       </ol>
    </div>
  )
}

export default CustomPageHeading
