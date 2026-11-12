/**
 * THIỆP MỜI TỐT NGHIỆP - APPLICATION SCRIPT (CORE LOGIC)
 * Giữ toàn bộ chức năng: cá nhân hóa khách mời, đếm ngược, lịch tháng,
 * nhạc nền Long Live, bản đồ, RSVP + Google Sheets, lưu bút & lightbox.
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = (typeof getSavedConfig === "function") ? getSavedConfig() : (window.DEFAULT_CONFIG || {});

  // 1. Phân tích tham số URL để cá nhân hóa tên khách mời (?to=, ?guest=, ?name=, ?u=)
  function getPersonalizedGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to") || urlParams.get("guest") || urlParams.get("name") || urlParams.get("u");
    if (guestParam && guestParam.trim()) {
      return guestParam.trim();
    }
    return config.defaultGuestName || "BẠN X";
  }

  const currentGuestName = getPersonalizedGuestName();

  // 2. Cập nhật dữ liệu từ Cấu hình (/admin hoặc config.js) lên giao diện
  function applyConfigToUI() {
    const gradName = config.graduateName || "PHẠM THỊ KIM HUÊ";
    const shortName = config.graduateShortName || "Kim Huê";

    const subtitleEl = document.getElementById("subtitleDisplay");
    if (subtitleEl && config.subtitle) subtitleEl.textContent = config.subtitle;

    const ribbonGrad = document.getElementById("ribbonGradName");
    if (ribbonGrad) ribbonGrad.textContent = gradName;

    const gradCalligraphy = document.getElementById("graduateCalligraphy");
    if (gradCalligraphy) gradCalligraphy.textContent = shortName;

    const guestDisplay = document.getElementById("guestNameDisplay");
    if (guestDisplay) guestDisplay.textContent = currentGuestName;

    const timeHighlight = document.getElementById("eventTimeHighlight");
    if (timeHighlight) {
      timeHighlight.textContent = config.displayDateTime || "17 NOV 2026 | AT 10:30-12:30 AM";
    }

    const venueTitleEl = document.getElementById("venueTitleDisplay");
    if (venueTitleEl) venueTitleEl.textContent = config.venueTitle || "NHÀ HÁT HÒA BÌNH";

    const badgeMonth = document.getElementById("badgeMonth");
    if (badgeMonth) badgeMonth.textContent = String(config.calendarMonth || 11).padStart(2, "0");

    const badgeDay = document.getElementById("badgeDay");
    if (badgeDay) badgeDay.textContent = String(config.eventDay || 17).padStart(2, "0");

    const badgeYear = document.getElementById("badgeYear");
    if (badgeYear) badgeYear.textContent = config.calendarYear || 2026;

    const calMonthScript = document.getElementById("calMonthScript");
    if (calMonthScript) calMonthScript.textContent = String(config.calendarMonth || 11);

    const venueAddress = document.getElementById("venueAddress");
    if (venueAddress) venueAddress.textContent = config.locationAddress || "240 ĐƯỜNG 3/2, PHƯỜNG HÒA HƯNG, TP HCM";

    const contactPhoneLink = document.getElementById("contactPhoneLink");
    if (contactPhoneLink) {
      const phone = config.contactPhone || "0373791033";
      contactPhoneLink.textContent = phone;
      contactPhoneLink.href = `tel:${phone.replace(/[^0-9+]/g, "")}`;
    }

    const mapBtn = document.getElementById("googleMapLinkBtn");
    if (mapBtn && config.googleMapsUrl) {
      mapBtn.href = config.googleMapsUrl;
      if (config.venueTitle) {
        mapBtn.innerHTML = `<span>📍</span> Chỉ Đường Đến ${escapeHTML(config.venueTitle)}`;
      }
    }

    const mapIframe = document.getElementById("googleMapIframe");
    if (mapIframe && config.googleMapsEmbed) mapIframe.src = config.googleMapsEmbed;

    const letterBody = document.getElementById("letterBodyContainer");
    if (letterBody && Array.isArray(config.letterParagraphs) && config.letterParagraphs.length > 0) {
      letterBody.innerHTML = config.letterParagraphs
        .map(p => `<p>${escapeHTML(p)}</p>`)
        .join("");
    }

    const letterSig = document.getElementById("letterSignature");
    if (letterSig) letterSig.textContent = gradName;

    const thankYouMsg = document.getElementById("thankYouMsgDisplay");
    if (thankYouMsg && config.thankYouMessage) {
      thankYouMsg.textContent = config.thankYouMessage;
    }

    // Tự động điền tên khách mời vào form RSVP nếu có ?to=
    const rsvpName = document.getElementById("rsvpName");
    if (rsvpName && currentGuestName !== "BẠN X") {
      rsvpName.value = currentGuestName;
    }

    // Cập nhật các vị trí ảnh (ẩn hoặc hiện placeholder khi chưa có URL ảnh)
    const updatePhotoSlot = (imgId, src) => {
      const img = document.getElementById(imgId);
      if (!img) return;
      const container = img.closest(".polaroid-card, [data-photo-slot]") || img.parentElement;
      const lightboxItem = img.closest(".album-grid-item");
      if (src && typeof src === "string" && src.trim() !== "" && !src.includes("assets/images/")) {
        const cleanSrc = src.trim();
        img.src = cleanSrc;
        if (container) container.classList.add("has-image");
        if (lightboxItem) lightboxItem.setAttribute("data-full", cleanSrc);
      } else {
        img.removeAttribute("src");
        if (container) container.classList.remove("has-image");
        if (lightboxItem) lightboxItem.removeAttribute("data-full");
      }
    };

    updatePhotoSlot("heroBgImg", config.heroBgSrc);
    updatePhotoSlot("filmStripImg", config.filmStripSrc);
    updatePhotoSlot("calendarPolaroidsImg", config.calendarPolaroidsSrc);
    updatePhotoSlot("letterPolaroidImg", config.footerPhotoSrc);
    updatePhotoSlot("footerPhotoImg", config.footerPhotoSrc);

    if (Array.isArray(config.albumPhotos)) {
      config.albumPhotos.forEach((src, idx) => {
        const albumImg = document.getElementById(`albumImg${idx + 1}`);
        const parentItem = albumImg ? albumImg.closest(".album-grid-item") : null;
        if (albumImg) {
          if (src && typeof src === "string" && src.trim() !== "" && !src.includes("assets/images/")) {
            albumImg.src = src.trim();
            if (parentItem) {
              parentItem.setAttribute("data-full", src.trim());
              parentItem.classList.add("has-image");
            }
          } else {
            albumImg.removeAttribute("src");
            if (parentItem) {
              parentItem.removeAttribute("data-full");
              parentItem.classList.remove("has-image");
            }
          }
        }
      });
    }
  }

  applyConfigToUI();

  // 3. Khởi tạo Lịch tháng (Calendar)
  function renderCalendar() {
    const month = config.calendarMonth || 11;
    const year = config.calendarYear || 2026;
    const targetDay = config.eventDay || 17;

    const grid = document.getElementById("calendarGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    daysOfWeek.forEach(d => {
      const cell = document.createElement("div");
      cell.className = "cal-header-cell";
      cell.textContent = d;
      grid.appendChild(cell);
    });

    const firstDayIndex = new Date(year, month - 1, 1).getDay();
    const shift = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < shift; i++) {
      const cell = document.createElement("div");
      cell.className = "cal-date-cell empty";
      grid.appendChild(cell);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "cal-date-cell";
      cell.textContent = day;
      if (day === targetDay) {
        cell.classList.add("event-date");
      }
      grid.appendChild(cell);
    }

    const totalCells = shift + totalDaysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 0; i < remaining; i++) {
      const cell = document.createElement("div");
      cell.className = "cal-date-cell empty";
      grid.appendChild(cell);
    }
  }

  renderCalendar();

  // 4. Thêm sự kiện vào Google Calendar
  const addToCalendarBtn = document.getElementById("addToCalendarBtn");
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener("click", () => {
      const title = encodeURIComponent(`Lễ Tốt Nghiệp của ${config.graduateName || "Phạm Thị Kim Huê"}`);
      const details = encodeURIComponent("Trân trọng kính mời bạn đến tham dự và chung vui trong ngày tốt nghiệp trọng đại!");
      const location = encodeURIComponent(config.locationAddress || "Số 2 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP.HCM");

      const startDate = new Date(config.targetDate || "2026-11-17T10:00:00");
      const endDate = new Date(startDate.getTime() + (4 * 60 * 60 * 1000));

      const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, "_blank");
    });
  }

  // 5. Đồng hồ Đếm ngược Thời gian thực (Real-time Countdown)
  const targetDateObj = new Date(config.targetDate || "2026-11-17T10:00:00").getTime();

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

  // 6. Nhạc nền (Long Live) và Bộ điều khiển phát/dừng
  const bgMusic = document.getElementById("bgMusic");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const musicStatusText = document.getElementById("musicStatusText");
  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;

    if (musicToggleBtn) {
      musicToggleBtn.classList.toggle("playing", playing);
    }
    if (musicStatusText) {
      musicStatusText.textContent = playing ? "Đang phát: Long Live" : "Bật nhạc: Long Live";
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

  if (bgMusic) {
    bgMusic.addEventListener("play", () => setPlayingState(true));
    bgMusic.addEventListener("pause", () => setPlayingState(false));

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
      if (isPlaying) bgMusic.play().catch(() => {});
    });
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!bgMusic) return;
      if (bgMusic.paused) {
        startAudio().catch(err => console.warn("Lỗi phát nhạc:", err));
      } else {
        stopAudio();
      }
    });
  }

  const onFirstUserGesture = (e) => {
    if (musicToggleBtn && (e.target === musicToggleBtn || musicToggleBtn.contains(e.target))) return;
    if (bgMusic && bgMusic.paused) {
      startAudio().catch(() => {});
    }
  };

  const gestureEvents = ["click", "touchend", "mouseup", "keydown"];
  function attachUnlockListeners() {
    gestureEvents.forEach(evt => window.addEventListener(evt, onFirstUserGesture, { passive: true }));
  }
  function detachUnlockListeners() {
    gestureEvents.forEach(evt => window.removeEventListener(evt, onFirstUserGesture));
  }
  attachUnlockListeners();

  // 7. Sổ lưu bút và Kết nối Đồng bộ Google Sheets
  const WISHES_STORAGE_KEY = "graduation_invitation_wishes_list";

  function getLocalWishes() {
    try {
      const stored = localStorage.getItem(WISHES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Lỗi khi đọc lời chúc:", e);
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
    const container = document.getElementById("wishesContainer");
    if (!container) return;

    container.innerHTML = "";
    wishes.forEach(item => {
      const wishEl = document.createElement("div");
      wishEl.className = "wish-item";

      wishEl.innerHTML = `
        <div class="wish-header">
          <span class="wish-author">${escapeHTML(item.name)}</span>
          <span class="wish-status-badge">${escapeHTML(item.status || "Gửi lời chúc")}</span>
        </div>
        <div class="wish-content">${escapeHTML(item.message)}</div>
        <div class="wish-time">${escapeHTML(item.time || "Vừa xong")}</div>
      `;
      container.appendChild(wishEl);
    });
  }

  async function loadWishes() {
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
        console.log("Dùng dữ liệu lời chúc offline:", err);
      }
    }
  }

  loadWishes();

  // 8. Xử lý Gửi Form Xác nhận tham dự (RSVP)
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

      if (!name || !message) {
        showToast("Vui lòng nhập tên và lời chúc của bạn nhé!");
        return;
      }

      const newWish = {
        name: name,
        status: status,
        message: message,
        time: "Vừa xong"
      };

      const currentList = getLocalWishes();
      currentList.unshift(newWish);
      saveLocalWishes(currentList);
      renderWishes(currentList);

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "ĐANG GỬI...";

      if (config.googleSheetScriptUrl && config.googleSheetScriptUrl.trim()) {
        try {
          await fetch(config.googleSheetScriptUrl.trim(), {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "submit_wish",
              name: name,
              status: status,
              message: message,
              timestamp: new Date().toISOString()
            })
          });
        } catch (error) {
          console.warn("Lỗi đồng bộ Sheets:", error);
        }
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      if (typeof confetti === "function") {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.65 },
          colors: ["#794a28", "#d4a373", "#cfa346", "#faf5f0", "#ffffff"]
        });
      }

      showToast(`Cảm ơn ${name} đã gửi lời chúc!`);
      messageInput.value = "";

      const wishesSec = document.getElementById("wishesSection");
      if (wishesSec) {
        wishesSec.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // 9. Modal xem ảnh phóng to (Lightbox)
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".album-grid-item").forEach(item => {
    item.addEventListener("click", () => {
      const fullSrc = item.getAttribute("data-full");
      if (fullSrc && lightboxModal && lightboxImg) {
        lightboxImg.src = fullSrc;
        lightboxModal.classList.add("active");
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (lightboxModal) lightboxModal.classList.remove("active");
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove("active");
      }
    });
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

  // 11. Mở bí mật Quản trị: Nhấp 3 lần vào dòng chân trang (không hiển thị gợi ý cho khách)
  const footerCredits = document.querySelectorAll(".footer-credit");
  if (footerCredits.length > 0) {
    let clickCount = 0;
    let clickTimer = null;
    footerCredits.forEach(fc => {
      fc.addEventListener("click", () => {
        clickCount++;
        clearTimeout(clickTimer);
        if (clickCount >= 3) {
          window.location.href = "/admin";
          clickCount = 0;
        } else {
          clickTimer = setTimeout(() => { clickCount = 0; }, 600);
        }
      });
    });
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g,
      tag => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[tag] || tag)
    );
  }
});
