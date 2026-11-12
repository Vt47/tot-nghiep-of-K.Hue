/**
 * CẤU HÌNH THIỆP MỜI TỐT NGHIỆP
 * Chủ đề Vintage Cream & Chocolate Brown (Graduation Party)
 */

function getDefaultTargetDate() {
  return "2026-11-17T10:30:00";
}

const DEFAULT_CONFIG = {
  // Thông tin cử nhân & sự kiện
  graduateName: "PHẠM THỊ KIM HUÊ",
  graduateShortName: "Kim Huê",
  subtitle: "YOU ARE INVITED TO",
  invitationTitle: "GRADUATION PARTY",
  guestPrefix: "Thân mời:",
  defaultGuestName: "BẠN X",

  // Thời gian tổ chức (17/11/2026, lúc 10:30-12:30 AM)
  targetDate: "2026-11-17T10:30:00",
  displayDateTime: "17 NOV 2026 | AT 10:30-12:30 AM",
  eventDayOfWeek: "THỨ BA",
  eventDay: 17,
  calendarMonth: 11,
  calendarYear: 2026,

  // Địa điểm, Liên hệ và Google Map
  venueTitle: "NHÀ HÁT HÒA BÌNH",
  locationAddress: "240 ĐƯỜNG 3/2, PHƯỜNG HÒA HƯNG, TP HCM",
  contactPhone: "0373791033",
  googleMapsUrl: "https://maps.google.com/?q=Nh%C3%A0+H%C3%A1t+H%C3%B2a+B%C3%ACnh,+240+%C4%90%C6%B0%E1%BB%9Dng+3/2,+Qu%E1%BA%ADn+10,+TP+HCM",
  googleMapsEmbed: "https://maps.google.com/maps?q=Nh%C3%A0%20H%C3%A1t%20H%C3%B2a%20B%C3%ACnh,%20240%20%C4%90%C6%B0%E1%BB%9Dng%203/2,%20TP%20HCM&t=&z=15&ie=UTF8&iwloc=&output=embed",

  // Kết nối Google Sheets tự động
  googleSheetScriptUrl: "https://script.google.com/macros/s/AKfycbyTNQzwT0g5SNDnphPAEqSzdi1UGKqKXmdk4zEV9gdK_hOnwbQSDxBtofYTpqs2ngQoHA/exec",

  // Hình ảnh Polaroid & Album (Thêm trong /admin)
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

  // Lời cảm ơn / kết thiệp
  thankYouTitle: "Thank you!",
  thankYouMessage: "MONG ĐƯỢC GẶP BẠN TRONG NGÀY ĐẶC BIỆT NÀY!",

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

      // Xoá các đường dẫn ảnh mẫu cũ đã xoá khỏi hệ thống
      const cleanImage = (url) => {
        if (!url || typeof url !== "string") return "";
        if (url.includes("assets/images/")) return "";
        return url;
      };

      const cleanedAlbum = Array.isArray(parsed.albumPhotos)
        ? parsed.albumPhotos.map(cleanImage)
        : ["", "", "", ""];

      // Nâng cấp tự động các giá trị mẫu cũ sang thông tin mới theo ảnh mẫu
      const isOldSubtitle = !parsed.subtitle || parsed.subtitle === "LỄ TỐT NGHIỆP CỦA";
      const isOldTime = !parsed.displayDateTime || parsed.displayDateTime === "17/11/2026 | Lúc 10h - 14h";
      const isOldLocation = !parsed.locationAddress || parsed.locationAddress.includes("Hoàng Văn Thụ");
      const isOldThankYou = !parsed.thankYouMessage || parsed.thankYouMessage.startsWith("Sự hiện diện của bạn chính là món quà");

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
        graduateName: graduateName,
        subtitle: isOldSubtitle ? DEFAULT_CONFIG.subtitle : parsed.subtitle,
        targetDate: isOldTime ? DEFAULT_CONFIG.targetDate : (parsed.targetDate || DEFAULT_CONFIG.targetDate),
        displayDateTime: isOldTime ? DEFAULT_CONFIG.displayDateTime : parsed.displayDateTime,
        venueTitle: parsed.venueTitle && parsed.venueTitle !== "TRUNG TÂM HỘI NGHỊ" ? parsed.venueTitle : DEFAULT_CONFIG.venueTitle,
        locationAddress: isOldLocation ? DEFAULT_CONFIG.locationAddress : parsed.locationAddress,
        contactPhone: parsed.contactPhone || DEFAULT_CONFIG.contactPhone,
        googleMapsUrl: isOldLocation ? DEFAULT_CONFIG.googleMapsUrl : (parsed.googleMapsUrl || DEFAULT_CONFIG.googleMapsUrl),
        googleMapsEmbed: isOldLocation ? DEFAULT_CONFIG.googleMapsEmbed : (parsed.googleMapsEmbed || DEFAULT_CONFIG.googleMapsEmbed),
        thankYouMessage: isOldThankYou ? DEFAULT_CONFIG.thankYouMessage : parsed.thankYouMessage,
        calendarMonth: parsed.calendarMonth || DEFAULT_CONFIG.calendarMonth,
        calendarYear: parsed.calendarYear || DEFAULT_CONFIG.calendarYear,
        eventDay: parsed.eventDay || DEFAULT_CONFIG.eventDay,
        musicSrc: DEFAULT_CONFIG.musicSrc,
        musicFallback: DEFAULT_CONFIG.musicFallback,
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
