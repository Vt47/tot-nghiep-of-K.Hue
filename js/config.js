/**
 * CẤU HÌNH THIỆP MỜI TỐT NGHIỆP
 * Chủ đề Vintage Cream & Chocolate Brown (Graduation Party)
 */

function getDefaultTargetDate() {
  return "2026-11-17T10:30:00";
}

const DEFAULT_CONFIG = {
  // Thông tin cử nhân & sự kiện (Thiệp dùng chung cho mọi người)
  graduateName: "PHẠM THỊ KIM HUÊ",
  graduateShortName: "Kim Huê",
  subtitle: "YOU ARE INVITED TO",
  invitationTitle: "GRADUATION PARTY",

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

  // Hình ảnh Polaroid & Album
  envMiniSrc: "assets/photos/photo_1.jpg",
  heroBgSrc: "assets/photos/photo_2.jpg",
  filmStripSrc: "assets/photos/photo_3.jpg",
  calendarPolaroidsSrc: "",
  footerPhotoSrc: "",
  albumPhotos: ["", "", "", ""],

  // Thư cảm ơn và lời mời dự lễ tốt nghiệp
  letterTitle: "THƯ CẢM ƠN VÀ LỜI MỜI DỰ LỄ TỐT NGHIỆP 🎓",
  letterParagraphs: [
    "Gửi những người đặc biệt trong những năm tháng tuổi trẻ của mình! 💗",
    "Vậy là cuối cùng mình cũng đã đi đến chặng cuối của những năm tháng đại học. Một hành trình tưởng chừng còn rất dài, vậy mà giờ đây đã trở thành những kỷ niệm thật đẹp.",
    "Mình thật sự biết ơn vì đã gặp được mọi người trong quãng thời gian này. Cảm ơn vì những lần gặp gỡ, những câu chuyện sẻ chia, những kỉ niệm vui buồn và những khi mọi người đã ở bên cạnh cả những lúc chẳng cần làm gì nhiều, chỉ đơn giản là có mặt. Có lẽ, điều đáng quý nhất khi nhìn lại những năm tháng sinh viên không chỉ là tấm bằng tốt nghiệp, mà còn là những người bạn mà mình may mắn có được.",
    "Ngày tốt nghiệp sắp tới không chỉ đánh dấu một cột mốc của riêng mình, mà còn là dịp để mình được chia sẻ niềm vui với những người mà mình trân trọng. Vì vậy, mình rất mong mọi người có thể đến tham dự và cùng mình lưu lại thêm một kỷ niệm đẹp nhé!",
    "Cảm ơn vì đã cùng mình viết nên một phần thanh xuân thật đáng nhớ. Mong rằng dù sau này mỗi người một hành trình, chúng ta vẫn sẽ luôn nhớ về nhau bằng những tình cảm thật đẹp.",
    "Hẹn gặp mọi người trong ngày đặc biệt của mình! 💗",
    "Thương mến!"
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
      name: "Mai Phương",
      status: "Chắc chắn tham dự",
      message: "Chúc mừng Kim Huê xuất sắc tốt nghiệp nhé! Chúc bạn tương lai rộng mở, luôn rạng rỡ và thành công rực rỡ trên con đường sự nghiệp!",
      time: "Vừa xong"
    },
    {
      name: "Anh Tuấn và Chị Hà",
      status: "Chắc chắn tham dự",
      message: "Tự hào về em gái lắm nha! Hẹn gặp em tại lễ tốt nghiệp để chụp thật nhiều ảnh xinh cùng cử nhân nha!",
      time: "15 phút trước"
    },
    {
      name: "Hoàng Nam (C3)",
      status: "Chắc chắn tham dự",
      message: "Chúc mừng tân cử nhân xuất sắc! Chúc cậu luôn giữ vững ngọn lửa nhiệt huyết và chinh phục mọi đỉnh cao mới nhé!",
      time: "1 giờ trước"
    },
    {
      name: "Cô Thanh Mai",
      status: "Gửi lời chúc",
      message: "Cô rất tự hào về nỗ lực và sự trưởng thành của em trong suốt những năm qua. Chúc em luôn vững bước và toả sáng trên hành trình phía trước!",
      time: "Hôm qua"
    }
  ]
};

// Trả về cấu hình thiệp dùng chung (dọn cache quản trị cũ nếu có)
function getSavedConfig() {
  try {
    localStorage.removeItem("graduation_invitation_config");
    localStorage.removeItem("graduation_admin_password");
  } catch (e) {
    // Bỏ qua lỗi quyền truy cập storage
  }
  return { ...DEFAULT_CONFIG };
}
