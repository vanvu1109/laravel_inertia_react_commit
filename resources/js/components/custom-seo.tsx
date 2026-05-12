import CustomCard from "./custom-card"
interface ISeoProps{

}
export default function Seo({

}:ISeoProps) {
  return (
    <CustomCard
        isShowHeader={true}
        title="Cấu Hình Seo"
        className="mt-[20px]"
        description="Nhập dầy đủ thông tin dưới đây"
    > 
        <div className="mb-[20px]">
            <div className="seo-preview bg-blue-400/35 p-[10px]">
                <div className="text-blue-500 mb-[10px] text-[18px]">Bạn chưa nhập tiêu đề để SEO</div>
                <div className="text-green-500 mb-[10px] text-[16px]">http://google.com/</div>
                <div className="text-gray-700 mb-[10px] text-[16px]">Bạn chưa nhập vào Mô Tả SEO</div>
            </div>
        </div>
    </CustomCard>
  )
}