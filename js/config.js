/**
 * CẤU HÌNH THIỆP MỜI TỐT NGHIỆP
 * Mẫu thiết kế chuẩn Lami Luxury Graduation (Tone Đỏ Rượu Vang và Vàng Ánh Kim)
 */

function getDefaultTargetDate() {
  return "2026-11-17T10:00:00";
}

const DEFAULT_CONFIG = {
  // Thông tin cử nhân / sự kiện (Giữ lại theo yêu cầu)
  graduateName: "PHẠM THỊ KIM HUÊ",
  graduateShortName: "Kim Huê",
  subtitle: "LỄ TỐT NGHIỆP CỦA",
  invitationTitle: "THÂN MỜI",
  guestPrefix: "HÂN HẠNH ĐÓN TIẾP:",
  defaultGuestName: "BẠN X",

  // Thời gian tổ chức (Giữ lại ngày 17/11/2026, lúc 10h - 14h)
  targetDate: "2026-11-17T10:00:00",
  displayDateTime: "17/11/2026 | Lúc 10h - 14h",
  eventDayOfWeek: "THỨ BA",
  eventDay: 17,
  calendarMonth: 11,
  calendarYear: 2026,

  // Địa điểm và Google Map
  locationAddress: "Số 2 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. HCM",
  venueTitle: "TRUNG TÂM HỘI NGHỊ",
  googleMapsUrl: "https://maps.google.com/?q=2+Ho%C3%A0ng+V%C4%83n+Th%E1%BB%A5,+Ph%C6%B0%E1%BB%9Dng+4,+T%C3%A2n+B%C3%ACnh,+TP+HCM",
  googleMapsEmbed: "https://maps.google.com/maps?q=2%20Ho%C3%A0ng%20V%C4%83n%20Th%E1%BB%A5,%20Ph%C6%B0%E1%BB%9Dng%204,%20T%C3%A2n%20B%C3%ACnh,%20TP%20HCM&t=&z=15&ie=UTF8&iwloc=&output=embed",

  // Kết nối Google Sheets tự động
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbyTNQzwT0g5SNDnphPAEqSzdi1UGKqKXmdk4zEV9gdK_hOnwbQSDxBtofYTpqs2ngQoHA/exec",

  // Hình ảnh cử nhân (Mặc định để trống để bạn tự thêm ảnh sau trong trang Quản trị)
  heroBgSrc: "",
  filmStripSrc: "",
  calendarPolaroidsSrc: "",
  footerPhotoSrc: "",
  albumPhotos: ["", "", "", ""],

  // Bức thư tâm sự
  letterParagraphs: [
    "Một hành trình đã khép lại bằng những ngày tháng đáng nhớ, từ những bỡ ngỡ ban đầu đến lúc trưởng thành hơn sau từng bài học, thử thách và trải nghiệm.",
    "Có những ngày mệt mỏi, có cả những lần muốn dừng bước, nhưng nhờ sự đồng hành của gia đình, thầy cô và bạn bè, mình đã đi đến cột mốc hôm nay. Tấm bằng tốt nghiệp không chỉ là kết quả của những năm tháng nỗ lực, mà còn là dấu mốc mở ra một hành trình mới với nhiều ước mơ và cơ hội đang chờ phía trước."
  ],

  // Nhạc nền: Taylor Swift - Long Live (Taylor's Version)
  musicSrc: "assets/audio/long_live.mp3",
  musicFallback: "assets/audio/long_live.m4a",

  // Lời cảm ơn bế mạc
  thankYouTitle: "Thank you!",
  thankYouMessage: "Sự hiện diện của bạn chính là món quà ý nghĩa nhất, và mình vô cùng trân quý trong ngày vui này.",

  // Lời chúc mẫu ban đầu
  initialWishes: [
    {
      name: "Mai Phương 🌸",
      status: "Chắc chắn tham dự",
      message: "Chúc mừng Kim Huê xuất sắc tốt nghiệp nhé! Chúc bạn tương lai rộng mở, luôn rạng rỡ và thành công rực rỡ trên con đường sự nghiệp! 🎓💐",
      time: "Vừa xong"
    },
    {
      name: "Anh Tuấn và Chị Hà ✨",
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
      const graduateName = (parsed.graduateName && parsed.graduateName !== "LÊ MINH THƯ" && parsed.graduateName !== "Nguyễn Tường Vi") 
        ? parsed.graduateName 
        : DEFAULT_CONFIG.graduateName;

      // Xoá triệt để các đường dẫn ảnh mẫu cũ đã xoá khỏi hệ thống
      const cleanImage = (url) => {
        if (!url || typeof url !== "string") return "";
        if (url.includes("assets/images/")) return "";
        return url;
      };

      const cleanedAlbum = Array.isArray(parsed.albumPhotos)
        ? parsed.albumPhotos.map(cleanImage)
        : ["", "", "", ""];

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        graduateName: graduateName,
        targetDate: parsed.targetDate || DEFAULT_CONFIG.targetDate,
        displayDateTime: parsed.displayDateTime || DEFAULT_CONFIG.displayDateTime,
        calendarMonth: parsed.calendarMonth || DEFAULT_CONFIG.calendarMonth,
        calendarYear: parsed.calendarYear || DEFAULT_CONFIG.calendarYear,
        eventDay: parsed.eventDay || DEFAULT_CONFIG.eventDay,
        musicSrc: DEFAULT_CONFIG.musicSrc,
        googleSheetScriptUrl: parsed.googleSheetScriptUrl || DEFAULT_CONFIG.googleSheetScriptUrl,
        heroBgSrc: cleanImage(parsed.heroBgSrc),
        filmStripSrc: cleanImage(parsed.filmStripSrc),
        calendarPolaroidsSrc: cleanImage(parsed.calendarPolaroidsSrc),
        footerPhotoSrc: cleanImage(parsed.footerPhotoSrc),
        albumPhotos: cleanedAlbum
      };
    }
  } catch (e) {
    console.error("Lỗi khi đọc config từ localStorage:", e);
  }
  return { ...DEFAULT_CONFIG };
}

// Lưu cấu hình vào localStorage
function saveConfig(newConfig) {
  try {
    const current = getSavedConfig();
    const merged = { ...current, ...newConfig };
    localStorage.setItem("graduation_invitation_config", JSON.stringify(merged));
    return true;
  } catch (e) {
    console.error("Lỗi khi lưu config:", e);
    return false;
  }
}
