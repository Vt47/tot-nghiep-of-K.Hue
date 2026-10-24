/**
 * CẤU HÌNH THIỆP MỜI TỐT NGHIỆP
 * Dễ dàng tùy chỉnh thông tin sự kiện của bạn tại đây
 */

function getDefaultTargetDate() {
  const now = new Date();
  const demoTarget = new Date(now.getTime() + (4 * 24 * 3600 * 1000) + (20 * 3600 * 1000) + (51 * 60 * 1000) + (6 * 1000));
  return demoTarget.toISOString();
}

const DEFAULT_CONFIG = {
  // Thông tin cử nhân / sự kiện
  graduateName: "LÊ MINH THƯ",
  subtitle: "LỄ TỐT NGHIỆP CỦA",
  invitationTitle: "THƯ MỜI THAM DỰ",
  guestPrefix: "HÂN HẠNH MỜI:",
  defaultGuestName: "BẠN X",

  // Thời gian tổ chức
  targetDate: "2026-11-17T10:00:00",
  displayDateTime: "17/11/2026 | Lúc 10h - 14h",
  
  // Tháng & Năm hiển thị trên lịch
  calendarMonth: 11, // Tháng 11
  calendarYear: 2026,
  eventDay: 17, // Ngày tổ chức có trái tim hồng (17/11/2026)

  // Địa điểm & Google Map
  locationAddress: "Số 2 , Hoàng Văn Thụ, P 4, Q.Tân Bình, TP HCM",
  googleMapsUrl: "https://maps.google.com/?q=2+Ho%C3%A0ng+V%C4%83n+Th%E1%BB%A5,+Ph%C6%B0%E1%BB%9Dng+4,+T%C3%A2n+B%C3%ACnh,+TP+HCM",
  googleMapsEmbed: "https://maps.google.com/maps?q=2%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5,%20Ph%C6%B0%E1%BB%9Dng%204,%20T%C3%A2n%20B%C3%ACnh,%20TP%20HCM&t=&z=15&ie=UTF8&iwloc=&output=embed",

  // KẾT NỐI GOOGLE SHEETS
  // Dán đường link Web App của Google Apps Script vào đây (ví dụ: https://script.google.com/macros/s/.../exec)
  // để tự động lưu khách mời và đồng bộ lời chúc trên mọi thiết bị!
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbyTNQzwT0g5SNDnphPAEqSzdi1UGKqKXmdk4zEV9gdK_hOnwbQSDxBtofYTpqs2ngQoHA/exec",

  // Hình ảnh
  illustrationSrc: "assets/images/graduate_illustration.png",
  topGarlandSrc: "assets/images/top_garland.png",

  // Lời cảm ơn cuối trang
  thankYouTitle: "Thank you!",
  thankYouMessage: "Những cố gắng của em/con/mình hôm nay cũng là nhờ sự đồng hành của mọi người. Mong được gặp thầy cô, bạn bè, anh chị trong ngày trọng đại này!",

  // Nhạc nền: Dream a Little Dream of Me (Đoạn điệp khúc)
  musicSrc: "assets/audio/dream_a_little_dream_chorus.mp3",

  // Lời chúc mẫu ban đầu (dùng khi chưa kết nối Google Sheets hoặc khi danh sách trống)
  initialWishes: [
    {
      name: "Mai Phương 🌸",
      status: "Chắc chắn tham dự",
      message: "Chúc mừng Minh Thư xuất sắc tốt nghiệp nhé! Chúc bạn tương lai rộng mở, luôn rạng rỡ và thành công rực rỡ trên con đường sự nghiệp! 🎓💐",
      time: "Vừa xong"
    },
    {
      name: "Anh Tuấn & Chị Hà ✨",
      status: "Chắc chắn tham dự",
      message: "Tự hào về em gái lắm nha! Hẹn gặp em tại lễ tốt nghiệp để chụp thật nhiều ảnh xinh cùng cử nhân nha! 🎉📸",
      time: "15 phút trước"
    },
    {
      name: "Hoàng Nam (C3) 🎓",
      status: "Chắc chắn tham dự",
      message: "Chúc mừng tân cử nhân xuất sắc! Chúc cậu luôn giữ vững ngọn lửa nhiệt huyết và chinh phục mọi đỉnh cao mới nhé! 💖",
      time: "1 giờ trước"
    },
    {
      name: "Cô Thanh Mai 💐",
      status: "Gửi lời chúc",
      message: "Cô rất tự hào về nỗ lực và sự trưởng thành của em trong suốt những năm qua. Chúc em luôn vững bước và toả sáng trên hành trình phía trước! 🌟",
      time: "Hôm qua"
    }
  ]
};

// Đọc cấu hình từ localStorage nếu đã được người dùng chỉnh sửa
function getSavedConfig() {
  try {
    const saved = localStorage.getItem("graduation_invitation_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        targetDate: DEFAULT_CONFIG.targetDate,
        displayDateTime: DEFAULT_CONFIG.displayDateTime,
        calendarMonth: DEFAULT_CONFIG.calendarMonth,
        calendarYear: DEFAULT_CONFIG.calendarYear,
        eventDay: DEFAULT_CONFIG.eventDay,
        musicSrc: DEFAULT_CONFIG.musicSrc,
        googleSheetScriptUrl: parsed.googleSheetScriptUrl || DEFAULT_CONFIG.googleSheetScriptUrl
      };
    }
  } catch (e) {
    console.error("Lỗi khi đọc config từ localStorage:", e);
  }
  return { ...DEFAULT_CONFIG };
}

window.APP_CONFIG = getSavedConfig();
