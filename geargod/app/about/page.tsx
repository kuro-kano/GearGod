import styles from './page.module.css'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <main className="text-white ambient-bg font-kanit-regular">
      <Navbar />
      <div className="min-h-screen p-8 pt-32 font-kanit-regular">
        <div className="max-w-3xl mx-auto font-kanit-regular">
          <h1 className="text-5xl font-inter-bold mb-6 ">
            About Me{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              GearGod
            </span>
          </h1>
          <div className="prose text-neutral-300">
            <p className="text-xl font-figtree-regular mb-6 font-kanit-regular">
              GearGod เป็นร้านค้าจัดจำหน่ายอุปกรณ์คอมพิวเตอร์และอุปกรณ์เสริม, อุปกรณ์เกมมิ่ง เราคัดสรรสินค้าคุณภาพจากแบรนด์ชั้นนำในราคาที่คุ้มค่าและรูปแบบมากมาย เพื่อให้ลูกค้าของเราได้รับประสบการณ์ที่ดีที่สุด
            </p>
            <h2 className="text-2xl font-inter-bold mb-4 text-white font-kanit-regular">ทำไมต้องเลือกเรา?</h2>
            <ul className="list-none space-y-3 text-lg ">
              <li className="flex items-center gap-2">
                <span className="text-green-500 ">✅</span> 
                สินค้าหลากหลาย – เรามีอุปกรณ์ไอทีครบทุกประเภท ตอบโจทย์ทุกการใช้งาน
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                สินค้าของแท้ 100% – มั่นใจได้ว่าสินค้าทุกชิ้นเป็นของแท้ พร้อมการรับประกัน
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                บริการให้คำแนะนำ – ทีมงานผู้เชี่ยวชาญพร้อมให้คำปรึกษาในการเลือกซื้อสินค้า
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                จัดส่งรวดเร็ว – รองรับการจัดส่งทั่วประเทศ รับสินค้าได้อย่างสะดวกสบาย
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                บริการหลังการขาย – รับประกันคุณภาพ พร้อมให้บริการซัพพอร์ตลูกค้า
              </li>
            </ul>
            <p className="text-xl font-figtree-regular mt-6 font-kanit-regular">
              เรามุ่งมั่นให้บริการที่ดีที่สุด ไม่ว่าคุณจะเป็นนักเรียน, นักศึกษา, คนทำงาน หรือเกมเมอร์ คุณสามารถเลือกซื้ออุปกรณ์ที่ตรงกับความต้องการของคุณได้ที่ GearGod
            </p>
            <p className="text-2xl font-inter-bold mt-8 text-center font-kanit-regular">
              GearGod – อุปกรณ์คอมพิวเตอร์ที่ถูกใจคุณที่สุด อยู่ที่ GearGod
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}