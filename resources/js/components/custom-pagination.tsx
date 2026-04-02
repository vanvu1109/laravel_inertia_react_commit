import type { ILinks } from "@/types"
import {
  Pagination,
  PaginationContent,
//   PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface ICusTomPaginationProps {
    links: ILinks[],
}


const CusTomPagination = ({
    links,
}: ICusTomPaginationProps) => {


   if(!links ||links.length === 0) {
    return null
   }

   const prevLinks = links.find((link) => link.label === '&laquo; Previous')
   const nextLinks = links.find((link) => link.label === 'Next &raquo;')
   const paginationLinks = links.filter((link) => link.label !== '&laquo; Previous' && link.label !== 'Next &raquo;') 
   const currentPage = links.find(link => link.active)?.label

    return (
        <div>
            <Pagination>
            <PaginationContent>
               {prevLinks &&  
               <PaginationItem>
                    <PaginationPrevious href={prevLinks.url} aria-disabled={currentPage === '1'} className={currentPage === '1' ? 'pointer-events-none opacity-50' : ''} />
                </PaginationItem>}

                {paginationLinks.map((link, index) => (
                    <PaginationItem key={index}>
                        <PaginationLink href={link.url} isActive={link.active}>
                            {link.label}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {nextLinks &&  
                <PaginationItem>
                    <PaginationNext href={nextLinks.url} aria-disabled={currentPage === paginationLinks.length.toString()} className={currentPage === paginationLinks.length.toString() ? 'pointer-events-none opacity-50' : ''}  />
                </PaginationItem>}

            </PaginationContent>
            </Pagination>
        </div>
    )
}

export default CusTomPagination
