# GearGod

แอปพลิเคชันเว็บสมัยใหม่สำหรับการจัดการอุปกรณ์และการเช่า

## สิ่งที่ต้องมีก่อนเริ่มใช้งาน

ก่อนที่จะรันแอปพลิเคชัน ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้งสิ่งต่อไปนี้:
- [Node.js](https://nodejs.org/) (เวอร์ชัน 18 หรือใหม่กว่า)
- npm (มักจะมาพร้อมกับ Node.js)

## การติดตั้ง

1. โคลนหรือดาวน์โหลดโปรเจคนี้
2. รันสคริปต์การติดตั้งเพื่อตั้งค่าไลบรารีที่จำเป็นทั้งหมด:
   ```
   install.bat
   ```
   การดำเนินการนี้จะติดตั้งไลบรารีที่จำเป็นทั้งหมดในไดเรกทอรี `geargod`

## การเรียกใช้แอปพลิเคชัน

เมื่อการติดตั้งเสร็จสมบูรณ์ คุณสามารถเริ่มแอปพลิเคชันโดยการรัน:
```
run.bat
```

แอปพลิเคชันควรจะเปิดในเบราว์เซอร์เริ่มต้นของคุณ หากไม่เปิด คุณสามารถเข้าถึงได้ที่ [http://localhost:3000](http://localhost:3000)

## ข้อมูลการเข้าสู่ระบบ

คุณสามารถใช้ข้อมูลประจำตัวต่อไปนี้เพื่อเข้าสู่ระบบแอปพลิเคชัน:

### บัญชีลูกค้า
- **ชื่อผู้ใช้:** johndoe@gmail.com
- **รหัสผ่าน:** 123

### บัญชีพนักงาน
- **ชื่อผู้ใช้:** staff@gmail.com
- **รหัสผ่าน:** 123

## คุณสมบัติ

- การจัดการคลังอุปกรณ์
- การประมวลผลและติดตามการเช่า
- การจัดการผู้ใช้
- การรายงานและการวิเคราะห์

## โครงสร้างโปรเจค

```
GearGod
 |- install.bat - สคริปต์การติดตั้ง
 |- run.bat - ตัวเรียกใช้แอปพลิเคชัน
 |- README.md - เอกสารนี้
 |- geargod/ - ไดเรกทอรีแอปพลิเคชันหลัก
    |- node_modules/ - ไลบรารี (สร้างหลังการติดตั้ง)
    |- app/ - ซอร์สโค้ด
    |- public/ - ไฟล์สถิต
    |- package.json - การกำหนดค่าโปรเจค
    |- ไฟล์อื่น ๆ
```

## การแก้ปัญหา

หากคุณพบปัญหาใดๆ ระหว่างการติดตั้งหรือการใช้งานแอปพลิเคชัน:

1. ตรวจสอบให้แน่ใจว่า Node.js ได้รับการติดตั้งอย่างถูกต้องโดยการรัน `node -v` ในพรอมต์คำสั่งของคุณ
2. ตรวจสอบว่าคุณมีสิทธิ์เพียงพอในการติดตั้งแพ็คเกจ
3. ตรวจสอบว่ามีไฟล์ package.json อยู่ในไดเรกทอรี geargod

## การสนับสนุน

สำหรับการสนับสนุนหรือคำถาม โปรดติดต่อผู้ดูแลโครงการ
