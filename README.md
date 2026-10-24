# 🎓 THIỆP MỜI LỄ TỐT NGHIỆP TRỰC TUYẾN (E-INVITATION)

Trang web thiệp mời tốt nghiệp điện tử được thiết kế tinh tế theo đúng phong cách mẫu video TikTok:
🔗 [Mẫu tham khảo TikTok](https://vt.tiktok.com/ZSgHuYK3v/)

---

## ✨ CÁC TÍNH NĂNG NỔI BẬT

1. **Giao diện Giấy Cổ Điển & Chữ Nghệ Thuật (Vintage Aesthetic):**
   - Viền dải cờ hoa trang trí phía trên (`top_garland.png`).
   - Hình vẽ nhân vật cử nhân chibi dễ thương, hai bên là bằng khen tốt nghiệp bay nhẹ (`graduate_illustration.png`).
   - Font chữ sang trọng (`Playfair Display`, `Montserrat`, `Great Vibes`).

2. **Cá nhân hóa Tên Khách Mời theo đường link:**
   - Hỗ trợ gửi link riêng cho từng người: `index.html?to=Tên+Khách+Mời` (Ví dụ: `?to=Lan+Anh`, `?to=Thầy+Tuấn`).
   - Thiệp sẽ tự động hiển thị: **HÂN HẠNH MỜI: BẠN LAN ANH**.
   - Có sẵn công cụ tạo link riêng ngay trên web: chỉ cần nhập tên và ấn **"Sao chép link"**.

3. **Lịch Tháng Sự Kiện (Calendar View):**
   - Bảng lịch tháng 1/2026 hiển thị chuyên nghiệp.
   - Ngày tổ chức (Ngày 24) được đánh dấu bằng **trái tim hồng nước đập nhẹ (pulsing pink heart)**.
   - Nút **"Thêm vào Google Calendar"** tự động lên lịch vào điện thoại với 1 cú click.

4. **Đồng Hồ Đếm Ngược Thời Gian Thực (Countdown Timer):**
   - 4 ô số kỹ thuật số: **[ Ngày ] [ Giờ ] [ Phút ] [ Giây ]** đếm ngược đến giờ khai mạc.

5. **Bản Đồ Chỉ Đường (Google Maps):**
   - Bản đồ Google Map tích hợp tương tác trực tiếp.
   - Nút **"❤️ Xem Google map ❤️"** mở ứng dụng bản đồ dẫn đường tận nơi.

6. **Xác Nhận Tham Dự & Sổ Lưu Bút (RSVP & Guestbook):**
   - Form khách mời gửi lời chúc và chọn trạng thái tham dự.
   - Hiệu ứng **bắn pháo hoa chúc mừng (Confetti 🎉)** rực rỡ khi ấn gửi.
   - Sổ lưu bút lưu lại và hiển thị trực tiếp tất cả lời chúc của bạn bè, người thân.
   - Tự động lưu trên trình duyệt (`localStorage`), không bị mất khi tải lại trang.

7. **Nhạc Nền Sôi Nổi & Ý Nghĩa:**
   - Trích xuất bài hát tốt nghiệp gốc từ video: `assets/audio/graduation_song.mp3`.
   - Nút đĩa nhạc vinyl xoay vòng ở góc dưới bên phải kèm sóng nhạc động.
   - Tự động bật nhạc khi người dùng tương tác / cuộn trang.

8. **Công Cụ Chỉnh Sửa Trực Tiếp:**
   - Nút **"✏️ Chỉnh sửa thiệp"** ở cuối trang giúp bạn sửa tên cử nhân, ngày giờ, địa chỉ, lời cảm ơn trực tiếp trên web mà không cần biết lập trình!

---

## 📁 CẤU TRÚC THƯ MỤC

```text
thiệp mời  tn/
├── index.html                   # Trang web thiệp mời chính
├── cover.jpg                    # Ảnh bìa xem trước khi chia sẻ link
├── css/
│   └── style.css                # Toàn bộ mã tạo kiểu giao diện & hiệu ứng
├── js/
│   ├── config.js                # Tệp cấu hình thông tin sự kiện
│   ├── app.js                   # Xử lý đếm ngược, lịch, nhạc, RSVP, lời chúc
│   └── confetti.browser.min.js  # Thư viện hiệu ứng pháo hoa
├── assets/
│   ├── audio/
│   │   └── graduation_song.mp3  # Nhạc nền tốt nghiệp
│   └── images/
│       ├── top_garland.png             # Dải cờ hoa viền trên
│       ├── graduate_illustration.png   # Hình minh hoạ cử nhân
│       └── heart.svg                   # Trái tim hồng đánh dấu lịch
└── README.md                    # Hướng dẫn sử dụng
```

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### 1. Mở xem trực tiếp trên máy tính
Bạn chỉ cần click đúp vào tệp `index.html` để mở thiệp trên bất kỳ trình duyệt nào (Chrome, Safari, Cốc Cốc, Edge, Firefox).

Hoặc khởi chạy server cục bộ:
```bash
python3 -m http.server 8080
```
Sau đó truy cập: `http://localhost:8080` trên trình duyệt.

---

## 📊 HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS (LƯU LỜI CHÚC & KHÁCH MỜI)

Để dữ liệu khách gửi tự động nhảy về Google Trang Tính trên Google Drive của bạn (hoàn toàn miễn phí):

### Bước 1: Tạo Google Trang Tính mới
1. Mở trình duyệt và truy cập: [https://sheets.new](https://sheets.new).
2. Đặt tên file (ví dụ: `Khách Mời Tốt Nghiệp`).
3. Ở hàng đầu tiên (Hàng 1), tạo 4 cột:
   - **Cột A:** `Thời gian gửi`
   - **Cột B:** `Tên khách mời`
   - **Cột C:** `Xác nhận tham dự`
   - **Cột D:** `Lời chúc`

### Bước 2: Dán mã Google Apps Script
1. Trên menu của Google Sheets, chọn: **Tiện ích mở rộng (Extensions)** ➔ **Apps Script**.
2. Xóa hết mã có sẵn trong đó.
3. Mở tệp `google_apps_script.js` trong thư mục này, copy toàn bộ nội dung và dán vào.
4. Nhấn nút **Lưu (Save 💾)**.

### Bước 3: Triển khai ứng dụng Web (Deploy)
1. Nhấn nút **Triển khai (Deploy)** ở góc trên bên phải ➔ Chọn **Tùy chọn triển khai mới (New deployment)**.
2. Tại mục "Chọn loại", bấm vào biểu tượng bánh răng ⚙️ ➔ Chọn **Ứng dụng web (Web app)**.
3. Cài đặt các mục:
   - **Thực thi dưới dạng (Execute as):** `Tôi (Me)`
   - **Ai có quyền truy cập (Who has access):** `Bất kỳ ai (Anyone)` *(Rất quan trọng! Để bạn bè gửi được)*
4. Nhấn nút **Triển khai (Deploy)**.
5. Google sẽ hiện cửa sổ cấp quyền: Chọn **Ủy quyền truy cập** ➔ Chọn tài khoản Google của bạn ➔ Bấm **Nâng cao (Advanced)** ➔ Bấm **Đi tới (Go to... unsafe)** ➔ Bấm **Cho phép (Allow)**.
6. Sao chép đường dẫn **URL ứng dụng web** (có dạng: `https://script.google.com/macros/s/.../exec`).

### Bước 4: Dán link vào thiệp
- Mở thiệp trên trình duyệt, cuộn xuống cuối ấn **"✏️ Chỉnh sửa thiệp"**.
- Dán URL vừa sao chép vào ô **"Link Google Apps Script (Lưu về Google Sheets)"** rồi ấn **"Lưu thay đổi ngay"**.
- *(Hoặc mở tệp `js/config.js` và dán vào dòng `googleSheetScriptUrl`)*.

Xong! Từ bây giờ, bất cứ khi nào ai gửi lời chúc:
✅ Dữ liệu tự động lưu vào Google Sheets trên Drive của bạn.
✅ Lời chúc tự động đồng bộ lên trang thiệp để tất cả mọi người cùng đọc được!

---
Bạn có 2 cách rất dễ dàng:

* **Cách 1 (Nhanh nhất):** Cuộn xuống cuối trang web, nhấn nút **"✏️ Chỉnh sửa thiệp"**, nhập tên của bạn, thời gian, địa điểm rồi ấn **"Lưu thay đổi"**.
* **Cách 2:** Mở tệp `js/config.js` bằng trình soạn thảo và sửa các trường:
  - `graduateName`: Tên cử nhân (Ví dụ: `"NGUYỄN VĂN A"`)
  - `displayDateTime`: Thời gian (Ví dụ: `"24/01/2026 | Lúc 10h - 14h"`)
  - `locationAddress`: Địa chỉ trường / hội trường tổ chức
  - `eventDay`: Ngày diễn ra sự kiện (để hiện trái tim hồng)

---

### 3. Tạo link mời riêng gửi cho từng người
Khi muốn gửi thiệp cho bạn bè:
1. Cuộn xuống cuối trang web, nhấn **"🔗 Tạo link mời riêng"**.
2. Nhập tên người nhận (Ví dụ: `Lan Anh`, `Anh Hoàng`, `Cả Nhà Cậu Năm`).
3. Nhấn **"📋 Sao chép link"** rồi gửi qua Zalo, Messenger, SMS!
4. Khi người đó ấn vào link, thiệp sẽ tự động hiển thị: **HÂN HẠNH MỜI: BẠN LAN ANH**!

---

### 4. Đưa thiệp lên mạng miễn phí (Để ai cũng mở được)

Bạn có thể đưa thiệp lên mạng miễn phí 100% bằng một trong các dịch vụ sau:

* **GitHub Pages:**
  1. Đẩy thư mục này lên một repository GitHub.
  2. Vào mục **Settings** -> **Pages** -> Chọn nhánh `main` và ấn **Save**.
  3. Bạn sẽ có link dạng: `https://ten-ban.github.io/thiep-tot-nghiep`

* **Vercel / Netlify:**
  - Chỉ cần kéo thả thư mục `thiệp mời  tn` vào [vercel.com](https://vercel.com) hoặc [netlify.com](https://netlify.com) là website chạy ngay lập tức!
