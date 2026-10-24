/**
 * THIỆP MỜI TỐT NGHIỆP - APPLICATION SCRIPT
 * Handling countdown, calendar, personalized links, music player, RSVP & Google Sheets sync
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = window.APP_CONFIG || {};

  // 1. Quản lý Màn hình Loading
  const loadingScreen = document.getElementById("loadingScreen");
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  }, 400);

  // 2. Phân tích tham số URL để cá nhân hoá tên khách mời (?to= hoặc ?guest=)
  function getPersonalizedGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to") || urlParams.get("guest") || urlParams.get("name");
    if (guestParam && guestParam.trim()) {
      return guestParam.trim();
    }
    return config.defaultGuestName || "BẠN X";
  }

  const currentGuestName = getPersonalizedGuestName();

  // Cập nhật giao diện với dữ liệu cấu hình
  function applyConfigToUI() {
    document.getElementById("invitationTitle").textContent = config.invitationTitle || "THƯ MỜI THAM DỰ";
    document.getElementById("subtitle").textContent = config.subtitle || "LỄ TỐT NGHIỆP CỦA";
    document.getElementById("graduateName").textContent = config.graduateName || "LÊ MINH THƯ";
    document.getElementById("guestPrefix").textContent = config.guestPrefix || "HÂN HẠNH MỜI:";
    document.getElementById("guestNameDisplay").textContent = currentGuestName;
    document.getElementById("eventDateTime").textContent = config.displayDateTime || "24/01/2026 | Lúc 10h - 14h";
    document.getElementById("eventLocation").textContent = config.locationAddress || "Số 2 , Hoàng Văn Thụ, P 4, Q.Tân Bình, TP HCM";
    
    // Hình ảnh
    const illustrationImg = document.getElementById("graduateIllustration");
    if (illustrationImg && config.illustrationSrc) {
      illustrationImg.src = config.illustrationSrc;
    }
    const garlandImg = document.getElementById("topGarland");
    if (garlandImg && config.topGarlandSrc) {
      garlandImg.src = config.topGarlandSrc;
    }

    // Google map link & embed
    const mapIframe = document.getElementById("googleMapIframe");
    if (mapIframe && config.googleMapsEmbed) {
      mapIframe.src = config.googleMapsEmbed;
    }
    const mapBtn = document.getElementById("googleMapLinkBtn");
    if (mapBtn && config.googleMapsUrl) {
      mapBtn.href = config.googleMapsUrl;
    }

    // Lời cảm ơn (cập nhật đồng thời cả trên Desktop và Mobile)
    document.querySelectorAll(".thank-you-title").forEach(el => {
      el.textContent = config.thankYouTitle || "Thank you!";
    });
    document.querySelectorAll(".thank-you-quote").forEach(el => {
      el.textContent = `"${config.thankYouMessage || ''}"`;
    });

    // Pre-fill tên vào form RSVP nếu tên khác BẠN X
    const rsvpNameInput = document.getElementById("rsvpName");
    if (rsvpNameInput && currentGuestName !== "BẠN X") {
      rsvpNameInput.value = currentGuestName;
    }
  }

  applyConfigToUI();

  // 3. Khởi tạo Lịch sự kiện (Calendar)
  function renderCalendar() {
    const month = config.calendarMonth || 1;
    const year = config.calendarYear || 2026;
    const targetDay = config.eventDay || 24;

    const monthTitle = document.getElementById("calMonthTitle");
    const yearTitle = document.getElementById("calYearTitle");
    if (monthTitle) monthTitle.textContent = `THÁNG ${String(month).padStart(2, '0')}`;
    if (yearTitle) yearTitle.textContent = `${year}`;

    const grid = document.getElementById("calendarDaysGrid");
    if (!grid) return;
    grid.innerHTML = "";

    // Tiêu đề các thứ trong tuần
    const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    daysOfWeek.forEach(d => {
      const el = document.createElement("div");
      el.className = "cal-day-header";
      el.textContent = d;
      grid.appendChild(el);
    });

    const firstDayIndex = new Date(year, month - 1, 1).getDay();
    const shift = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < shift; i++) {
      const cell = document.createElement("div");
      cell.className = "cal-cell empty";
      cell.textContent = "-";
      grid.appendChild(cell);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "cal-cell";

      if (day === targetDay) {
        cell.classList.add("event-date");
        cell.innerHTML = `
          <img src="assets/images/heart.svg" class="heart-marker" alt="Event Day Heart" />
          <span class="date-number">${day}</span>
        `;
      } else {
        cell.textContent = day;
      }
      grid.appendChild(cell);
    }

    const totalCells = shift + totalDaysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      const cell = document.createElement("div");
      cell.className = "cal-cell empty";
      cell.textContent = "-";
      grid.appendChild(cell);
    }
  }

  renderCalendar();

  // 4. Đồng hồ Đếm ngược Thời gian thực (Real-time Countdown)
  const targetDateObj = new Date(config.targetDate || "2026-01-24T10:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDateObj - now;

    const daysEl = document.getElementById("timerDays");
    const hoursEl = document.getElementById("timerHours");
    const minsEl = document.getElementById("timerMins");
    const secsEl = document.getElementById("timerSecs");

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Thêm sự kiện vào Google Calendar
  const addToCalendarBtn = document.getElementById("addToCalendarBtn");
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener("click", () => {
      const title = encodeURIComponent(`Lễ Tốt Nghiệp của ${config.graduateName || "Lê Minh Thư"}`);
      const details = encodeURIComponent(`Trân trọng kính mời bạn đến tham dự và chung vui trong ngày tốt nghiệp trọng đại!`);
      const location = encodeURIComponent(config.locationAddress || "Số 2 Hoàng Văn Thụ, P.4, Q.Tân Bình, TP.HCM");
      
      const startDate = new Date(config.targetDate || "2026-01-24T10:00:00");
      const endDate = new Date(startDate.getTime() + (4 * 60 * 60 * 1000));

      const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, "_blank");
    });
  }

  // 6. Nhạc nền & Nút điều khiển âm thanh
  const bgMusic = document.getElementById("bgMusic");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;
    if (!musicToggleBtn) return;
    if (playing) {
      musicToggleBtn.classList.add("playing");
      musicToggleBtn.setAttribute("aria-label", "Tạm dừng nhạc");
      const waves = document.getElementById("soundWaves");
      if (waves) waves.style.display = "flex";
    } else {
      musicToggleBtn.classList.remove("playing");
      musicToggleBtn.setAttribute("aria-label", "Phát nhạc");
      const waves = document.getElementById("soundWaves");
      if (waves) waves.style.display = "none";
    }
  }

  function startAudio() {
    if (!bgMusic) return Promise.reject(new Error("No audio element"));
    return bgMusic.play().then(() => {
      setPlayingState(true);
      detachUnlockListeners();
    });
  }

  function stopAudio() {
    if (!bgMusic) return;
    bgMusic.pause();
    setPlayingState(false);
  }

  // Đồng bộ trạng thái trực tiếp từ sự kiện phát/dừng của thẻ audio
  if (bgMusic) {
    bgMusic.addEventListener("play", () => {
      setPlayingState(true);
      detachUnlockListeners();
    });

    bgMusic.addEventListener("pause", () => {
      setPlayingState(false);
    });

    // Cơ chế lặp nhạc liền mạch (seamless zero-latency loop)
    bgMusic.addEventListener("timeupdate", () => {
      if (bgMusic.duration && bgMusic.currentTime >= bgMusic.duration - 0.2) {
        bgMusic.currentTime = 0;
        if (bgMusic.paused && isPlaying) {
          bgMusic.play().catch(() => {});
        }
      }
    });

    bgMusic.addEventListener("ended", () => {
      bgMusic.currentTime = 0;
      if (isPlaying) {
        bgMusic.play().catch(() => {});
      }
    });
  }

  // Nút tròn bật/tắt nhạc ở góc màn hình
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!bgMusic) return;

      if (bgMusic.paused) {
        startAudio().catch(err => {
          console.warn("Không thể phát nhạc:", err);
        });
      } else {
        stopAudio();
      }
    });
  }

  // Mở khóa âm thanh ở tương tác đầu tiên bất kỳ của người dùng (Click, Chạm, Cuộn trang, Phím)
  const onFirstUserGesture = (e) => {
    // Nếu chạm/click vào chính nút musicToggleBtn thì bỏ qua để nút tự xử lý
    if (musicToggleBtn && (e.target === musicToggleBtn || musicToggleBtn.contains(e.target))) {
      return;
    }

    if (bgMusic && bgMusic.paused) {
      startAudio().catch(() => {
        // Nếu cử chỉ này chưa đủ điều kiện (ví dụ scroll trên một số trình duyệt), tiếp tục đợi cử chỉ kế tiếp
      });
    }
  };

  const gestureEvents = ["click", "touchend", "mouseup", "keydown", "scroll", "wheel"];

  function attachUnlockListeners() {
    gestureEvents.forEach(evt => {
      window.addEventListener(evt, onFirstUserGesture, { passive: true });
    });
  }

  function detachUnlockListeners() {
    gestureEvents.forEach(evt => {
      window.removeEventListener(evt, onFirstUserGesture);
    });
  }

  attachUnlockListeners();

  // Thử tự động phát ngay khi vừa load (hoạt động tốt trên máy tính có MEI hoặc trình duyệt cho phép autoplay)
  if (bgMusic) {
    startAudio().catch(() => {
      // Trình duyệt chặn autoplay khi mới vào trang, đợi tương tác đầu tiên từ người dùng
    });
  }

  // 7. Sổ lưu bút & Tích hợp Đồng bộ Google Sheets
  const WISHES_STORAGE_KEY = "graduation_invitation_wishes_list";

  function getLocalWishes() {
    try {
      const stored = localStorage.getItem(WISHES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Lỗi khi đọc lời chúc từ storage:", e);
    }
    return config.initialWishes || [];
  }

  function saveLocalWishes(list) {
    try {
      localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Lỗi khi lưu lời chúc:", e);
    }
  }

  function renderWishes(wishes) {
    const wishesContainer = document.getElementById("wishesContainer");
    if (!wishesContainer) return;

    wishesContainer.innerHTML = "";
    wishes.forEach(item => {
      const wishEl = document.createElement("div");
      wishEl.className = "wish-item";

      const isDecline = item.status && (item.status.includes("tiếc") || item.status.includes("Bận"));
      const badgeClass = isDecline ? "wish-status-badge decline" : "wish-status-badge";

      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(item.name)}</span>
          <span class="${badgeClass}">${escapeHTML(item.status || 'Gửi lời chúc')}</span>
        </div>
        <div class="wish-content">${escapeHTML(item.message)}</div>
        <div class="wish-time">${escapeHTML(item.time || 'Vừa xong')}</div>
      `;
      wishesContainer.appendChild(wishEl);
    });
  }

  // Tải danh sách lời chúc: ưu tiên Google Sheets nếu có cài đặt
  async function loadWishes() {
    // Trước tiên hiển thị dữ liệu cục bộ ngay lập tức để không bị trễ
    const localWishes = getLocalWishes();
    renderWishes(localWishes);

    if (config.googleSheetScriptUrl && config.googleSheetScriptUrl.trim()) {
      try {
        const response = await fetch(config.googleSheetScriptUrl.trim(), {
          method: "GET",
          headers: { "Accept": "application/json" }
        });
        if (response.ok) {
          const resData = await response.json();
          if (resData.wishes && resData.wishes.length > 0) {
            saveLocalWishes(resData.wishes);
            renderWishes(resData.wishes);
          }
        }
      } catch (err) {
        console.log("Không thể kết nối Google Sheets (hoặc mạng offline), hiển thị dữ liệu bộ nhớ đệm:", err);
      }
    }
  }

  loadWishes();

  // 8. Xử lý gửi Form Xác nhận tham dự (RSVP) & Lưu về Google Sheets
  const rsvpForm = document.getElementById("rsvpForm");
  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("rsvpName");
      const statusSelect = document.getElementById("rsvpStatus");
      const messageInput = document.getElementById("rsvpMessage");
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');

      const name = nameInput.value.trim();
      const status = statusSelect.value;
      const message = messageInput.value.trim();

      if (!name) {
        showToast("Vui lòng nhập tên của bạn nhé!");
        nameInput.focus();
        return;
      }

      if (!message) {
        showToast("Hãy để lại một lời chúc ý nghĩa đến tân cử nhân nhé!");
        messageInput.focus();
        return;
      }

      // Vô hiệu hóa nút tạm thời khi đang gửi
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Đang gửi lời chúc...";

      const newWish = {
        name: name,
        status: status,
        message: message,
        time: "Vừa xong"
      };

      // 1. Cập nhật giao diện ngay lập tức (Optimistic Update)
      const wishes = getLocalWishes();
      wishes.unshift(newWish);
      saveLocalWishes(wishes);
      renderWishes(wishes);

      // 2. Gửi dữ liệu về Google Sheets (nếu có cấu hình Web App URL)
      if (config.googleSheetScriptUrl && config.googleSheetScriptUrl.trim()) {
        try {
          await fetch(config.googleSheetScriptUrl.trim(), {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(newWish)
          });
          console.log("Đã gửi thành công về Google Sheets!");
        } catch (postErr) {
          console.error("Lỗi khi gửi về Google Sheets:", postErr);
        }
      }

      // Khôi phục nút
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Hiệu ứng pháo hoa chúc mừng (Confetti)
      fireConfetti();

      // Thông báo thành công
      showToast(`Cảm ơn ${name} đã gửi lời chúc yêu thương! 🥰`);

      // Reset ô nhập lời chúc
      messageInput.value = "";

      // Cuộn nhẹ tới sổ lưu bút
      const wishesSec = document.getElementById("wishesSection");
      if (wishesSec) {
        wishesSec.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // 9. Hiệu ứng Confetti
  function fireConfetti() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ffb6c1', '#ec407a', '#ffd700', '#f48fb1', '#81d4fa']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffb6c1', '#ec407a', '#ffd700']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffb6c1', '#ec407a', '#ffd700']
        });
      }, 250);
    }
  }

  // 10. Thông báo Toast
  function showToast(text) {
    let toast = document.getElementById("toastNotice");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toastNotice";
      toast.className = "toast-notice";
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  // 11. Modal Tạo Link Mời Riêng cho từng khách
  const linkModal = document.getElementById("linkModal");
  const openLinkModalBtn = document.getElementById("openLinkModalBtn");
  const closeLinkModalBtn = document.getElementById("closeLinkModalBtn");
  const guestNameInput = document.getElementById("customGuestNameInput");
  const generatedLinkOutput = document.getElementById("generatedLinkOutput");
  const copyLinkBtn = document.getElementById("copyLinkBtn");
  const testLinkBtn = document.getElementById("testLinkBtn");

  function updateGeneratedLink() {
    const rawName = guestNameInput.value.trim();
    const baseUrl = window.location.origin + window.location.pathname;
    if (rawName) {
      const fullUrl = `${baseUrl}?to=${encodeURIComponent(rawName)}`;
      generatedLinkOutput.textContent = fullUrl;
      testLinkBtn.href = fullUrl;
    } else {
      generatedLinkOutput.textContent = baseUrl;
      testLinkBtn.href = baseUrl;
    }
  }

  if (openLinkModalBtn) {
    openLinkModalBtn.addEventListener("click", () => {
      linkModal.classList.add("active");
      guestNameInput.value = "";
      updateGeneratedLink();
      guestNameInput.focus();
    });
  }

  if (closeLinkModalBtn) {
    closeLinkModalBtn.addEventListener("click", () => {
      linkModal.classList.remove("active");
    });
  }

  if (guestNameInput) {
    guestNameInput.addEventListener("input", updateGeneratedLink);
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", () => {
      const linkText = generatedLinkOutput.textContent;
      navigator.clipboard.writeText(linkText).then(() => {
        showToast("Đã sao chép link mời vào bộ nhớ tạm! 📋");
      }).catch(() => {
        const temp = document.createElement("textarea");
        temp.value = linkText;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("Đã sao chép link mời! 📋");
      });
    });
  }

  // Đóng modal khi click ra ngoài overlay
  window.addEventListener("click", (e) => {
    if (e.target === linkModal) linkModal.classList.remove("active");
    const editModal = document.getElementById("editModal");
    if (e.target === editModal) editModal.classList.remove("active");
  });

  // 12. Modal Chỉnh sửa thông tin thiệp & Kết nối Google Sheets trực tiếp
  const editModal = document.getElementById("editModal");
  const openEditModalBtn = document.getElementById("openEditModalBtn");
  const closeEditModalBtn = document.getElementById("closeEditModalBtn");
  const editForm = document.getElementById("editCardForm");

  if (openEditModalBtn) {
    openEditModalBtn.addEventListener("click", () => {
      document.getElementById("editGraduateName").value = config.graduateName || "";
      document.getElementById("editDateTime").value = config.displayDateTime || "";
      document.getElementById("editAddress").value = config.locationAddress || "";
      document.getElementById("editGoogleSheetUrl").value = config.googleSheetScriptUrl || "";
      document.getElementById("editThankYou").value = config.thankYouMessage || "";
      editModal.classList.add("active");
    });
  }

  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener("click", () => {
      editModal.classList.remove("active");
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      config.graduateName = document.getElementById("editGraduateName").value.trim() || config.graduateName;
      config.displayDateTime = document.getElementById("editDateTime").value.trim() || config.displayDateTime;
      config.locationAddress = document.getElementById("editAddress").value.trim() || config.locationAddress;
      config.googleSheetScriptUrl = document.getElementById("editGoogleSheetUrl").value.trim();
      config.thankYouMessage = document.getElementById("editThankYou").value.trim() || config.thankYouMessage;

      localStorage.setItem("graduation_invitation_config", JSON.stringify(config));
      applyConfigToUI();
      editModal.classList.remove("active");

      // Tải lại lời chúc từ Sheets nếu có URL mới
      loadWishes();

      showToast("Đã lưu thay đổi & kết nối Google Sheets! ✨");
    });
  }

  // 13. Phân quyền hiển thị Thanh công cụ Chủ thiệp (Ẩn với khách mời)
  const hostToolsBar = document.querySelector(".host-tools-bar");
  const footerCredit = document.querySelector(".footer-credit");
  const queryParams = new URLSearchParams(window.location.search);

  // Kích hoạt quyền admin khi vào bằng link ?admin=true hoặc máy chủ nhà
  if (queryParams.get("admin") === "true") {
    localStorage.setItem("is_invitation_host", "true");
  }

  const isHost = localStorage.getItem("is_invitation_host") === "true";
  if (isHost && hostToolsBar) {
    hostToolsBar.classList.add("show");
  }

  // Mở bí mật: Nhấp 3 lần liên tiếp vào dòng "ktv © 2026"
  const footerCredits = document.querySelectorAll(".footer-credit");
  if (footerCredits.length > 0 && hostToolsBar) {
    let clickCount = 0;
    let clickTimer = null;
    footerCredits.forEach(fc => {
      fc.title = "Dành cho chủ thiệp: Nhấp 3 lần để ẩn/hiện công cụ";
      fc.style.cursor = "pointer";
      fc.addEventListener("click", () => {
        clickCount++;
        clearTimeout(clickTimer);

        if (clickCount >= 3) {
          hostToolsBar.classList.toggle("show");
          const isShown = hostToolsBar.classList.contains("show");
          localStorage.setItem("is_invitation_host", isShown ? "true" : "false");
          showToast(isShown ? "Đã bật thanh công cụ Chủ thiệp! ⚙️" : "Đã ẩn thanh công cụ với khách! 🔒");
          clickCount = 0;
        } else {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 600);
        }
      });
    });
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // 10. Khởi tạo Hiệu ứng Cuộn Hiện (Scroll Reveal)
  function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal-on-scroll");
    if (!revealEls.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      });

      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add("is-revealed"));
    }
  }

  initScrollReveal();

  // 11. Hiệu ứng Cánh hoa rơi & Bụi sao lấp lánh (Romantic Petals & Golden Starlight)
  function initRomanticAtmosphere() {
    const canvas = document.getElementById("fxCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    }, { passive: true });

    // Cánh hoa mềm mại (Petals)
    const petals = [];
    const petalColors = [
      "rgba(255, 192, 203, 0.65)",
      "rgba(255, 182, 193, 0.55)",
      "rgba(255, 228, 225, 0.7)",
      "rgba(244, 143, 177, 0.45)"
    ];
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 12 : 20;

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.7 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01
      });
    }

    // Hạt bụi sao vàng lấp lánh ("A little dream of me, glowing like a star")
    const stars = [];
    const starCount = isMobile ? 10 : 18;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.8,
        alpha: Math.random(),
        alphaSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
        speedY: Math.random() * 0.2 + 0.08
      });
    }

    let isRunning = true;
    document.addEventListener("visibilitychange", () => {
      isRunning = !document.hidden;
      if (isRunning) requestAnimationFrame(animate);
    });

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.flip), 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // Cánh hoa
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.008) * 0.4 + p.speedX;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      }

      // Hạt sao vàng
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y -= s.speedY;
        s.alpha += s.alphaSpeed;
        if (s.alpha >= 0.85 || s.alpha <= 0.15) {
          s.alphaSpeed = -s.alphaSpeed;
        }
        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        ctx.save();
        ctx.fillStyle = `rgba(246, 211, 101, ${Math.max(0, Math.min(1, s.alpha))})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "rgba(255, 215, 0, 0.55)";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  initRomanticAtmosphere();
});
