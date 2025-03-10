import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <main className="text-white ambient-bg font-kanit-regular">
      <Navbar />
      <div className="min-h-screen p-4 md:p-8 pt-24 md:pt-32">
        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-inter-bold mb-6 animate-fade-in">
              About Me{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent hover:from-amber-500 hover:to-yellow-400 transition-all duration-300">
                GearGod
              </span>
            </h1>
          </header>

          <article className="prose prose-invert max-w-none text-neutral-300">
            <p className="text-lg md:text-xl mb-8 leading-relaxed">
              GearGod เป็นร้านค้าจัดจำหน่ายอุปกรณ์คอมพิวเตอร์และอุปกรณ์เสริม, อุปกรณ์เกมมิ่ง เราคัดสรรสินค้าคุณภาพจากแบรนด์ชั้นนำในราคาที่คุ้มค่าและรูปแบบมากมาย เพื่อให้ลูกค้าของเราได้รับประสบการณ์ที่ดีที่สุด
            </p>

            <section>
              <h2 className="text-2xl md:text-3xl font-kanit-regular mb-6 text-white">
                ทำไมต้องเลือกเรา?
              </h2>
              <ul className="list-none space-y-4 text-base md:text-lg">
                {[
                  'สินค้าหลากหลาย – เรามีอุปกรณ์ไอทีครบทุกประเภท ตอบโจทย์ทุกการใช้งาน',
                  'สินค้าของแท้ 100% – มั่นใจได้ว่าสินค้าทุกชิ้นเป็นของแท้ พร้อมการรับประกัน',
                  'บริการให้คำแนะนำ – ทีมงานผู้เชี่ยวชาญพร้อมให้คำปรึกษาในการเลือกซื้อสินค้า',
                  'จัดส่งรวดเร็ว – รองรับการจัดส่งทั่วประเทศ รับสินค้าได้อย่างสะดวกสบาย',
                  'บริการหลังการขาย – รับประกันคุณภาพ พร้อมให้บริการซัพพอร์ตลูกค้า'
                ].map((text, index) => (
                  <li key={index} className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-200">
                    <span className="text-green-500 flex-shrink-0">✅</span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <footer className="mt-12 space-y-6">
              <p className="text-lg md:text-xl leading-relaxed">
                เรามุ่งมั่นให้บริการที่ดีที่สุด ไม่ว่าคุณจะเป็นนักเรียน, นักศึกษา หรือคนทำงาน คุณก็สามารถเลือกซื้ออุปกรณ์ที่ตรงกับความต้องการของคุณได้ที่ GearGod
              </p>
              <p className="text-xl md:text-2xl font-inter-bold text-center bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                GearGod – <span className='font-kanit-regular'>อุปกรณ์คอมพิวเตอร์ที่ถูกใจคุณที่สุด อยู่ที่ </span>GearGod
              </p>
            </footer>
          </article>
        </div>
      </div>
    </main>
  )
}