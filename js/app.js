/**
 * THIỆP MỜI TỐT NGHIỆP - APPLICATION SCRIPT
 * Chuẩn phong cách Lami Luxury Red & Gold
 * Quản lý hiệu ứng chữ, cuộn hiện mượt mà, đồng bộ máy tính & điện thoại
 */

document.addEventListener("DOMContentLoaded", () => {
  const config = (typeof getSavedConfig === "function") ? getSavedConfig() : (window.DEFAULT_CONFIG || {});

  // 1. Quản lý Màn hình Loading
  const loadingScreen = document.getElementById("loadingScreen");
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }
  }, 350);

  // 2. Phân tích tham số URL để cá nhân hóa tên khách mời (?to=, ?guest=, ?name=, ?u=)
  function getPersonalizedGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to") || urlParams.get("guest") || urlParams.get("name") || urlParams.get("u");
    if (guestParam && guestParam.trim()) {
      return guestParam.trim();
    }
    return config.defaultGuestName || "BẠN X";
  }

  const currentGuestName = getPersonalizedGuestName();

  // 3. Cập nhật dữ liệu từ Cấu hình lên Giao diện
  function applyConfigToUI() {
    const gradName = config.graduateName || "PHẠM THỊ KIM HUÊ";
    const shortName = config.graduateShortName || "Kim Huê";

    // Tên cử nhân trên ruy băng đỏ và cột máy tính
    const ribbonGrad = document.getElementById("ribbonGradName");
    if (ribbonGrad) ribbonGrad.textContent = gradName;

    const desktopGrad = document.getElementById("desktopGradName");
    if (desktopGrad) desktopGrad.textContent = gradName;

    // Tên cử nhân thư pháp phần Thân Mời
    const gradCalligraphy = document.getElementById("graduateCalligraphy");
    if (gradCalligraphy) gradCalligraphy.textContent = shortName;

    // Tên khách mời trên con dấu và thư mời
    const envGuest = document.getElementById("envelopeGuestName");
    if (envGuest) envGuest.textContent = currentGuestName;

    const guestDisplay = document.getElementById("guestNameDisplay");
    if (guestDisplay) guestDisplay.textContent = currentGuestName;

    // Thời gian sự kiện
    const timeHighlight = document.getElementById("eventTimeHighlight");
    if (timeHighlight) {
      timeHighlight.textContent = config.displayDateTime || "10:00, THỨ BA";
    }

    // Ngày hiển thị dưới ảnh Hero: 17.11.2026
    const heroDate = document.getElementById("heroDateDisplay");
    if (heroDate) {
      const d = String(config.eventDay || 17).padStart(2, "0");
      const m = String(config.calendarMonth || 11).padStart(2, "0");
      const y = config.calendarYear || 2026;
      heroDate.textContent = `${d}.${m}.${y}`;
    }

    // Badge Ngày Tháng Năm
    const badgeMonth = document.getElementById("badgeMonth");
    if (badgeMonth) badgeMonth.textContent = String(config.calendarMonth || 11).padStart(2, "0");

    const badgeDay = document.getElementById("badgeDay");
    if (badgeDay) badgeDay.textContent = String(config.eventDay || 17).padStart(2, "0");

    const badgeYear = document.getElementById("badgeYear");
    if (badgeYear) badgeYear.textContent = config.calendarYear || 2026;

    const calMonthScript = document.getElementById("calMonthScript");
    if (calMonthScript) calMonthScript.textContent = String(config.calendarMonth || 11);

    // Địa điểm
    const venueAddress = document.getElementById("venueAddress");
    if (venueAddress) venueAddress.textContent = config.locationAddress || "Số 2 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP. HCM";

    // Link chỉ đường và bản đồ nhúng
    const mapBtn = document.getElementById("googleMapLinkBtn");
    if (mapBtn && config.googleMapsUrl) mapBtn.href = config.googleMapsUrl;

    const mapIframe = document.getElementById("googleMapIframe");
    if (mapIframe && config.googleMapsEmbed) mapIframe.src = config.googleMapsEmbed;

    // Chữ ký bức thư tâm sự
    const letterSig = document.getElementById("letterSignature");
    if (letterSig) letterSig.textContent = gradName;

    // Pre-fill tên vào form RSVP nếu đã có tên khách riêng
    const rsvpName = document.getElementById("rsvpName");
    if (rsvpName && currentGuestName !== "BẠN X") {
      rsvpName.value = currentGuestName;
    }

    // Cập nhật hình ảnh (Khi người dùng thêm ảnh sau trong /admin)
    const updatePhotoSlot = (imgId, src) => {
      const img = document.getElementById(imgId);
      if (!img) return;
      const container = img.closest(".image-fallback-container") || img.parentElement;
      if (src && typeof src === "string" && src.trim() !== "" && !src.includes("assets/images/")) {
        img.src = src.trim();
        img.style.display = "block";
        img.classList.remove("img-load-error");
        if (container) {
          container.classList.add("has-image");
          container.classList.remove("no-image");
        }
      } else {
        img.removeAttribute("src");
        img.style.display = "none";
        if (container) {
          container.classList.remove("has-image");
          container.classList.add("no-image");
        }
      }
    };

    updatePhotoSlot("heroBgImg", config.heroBgSrc);
    updatePhotoSlot("filmStripImg", config.filmStripSrc);
    updatePhotoSlot("calendarPolaroidsImg", config.calendarPolaroidsSrc);
    updatePhotoSlot("letterPolaroidImg", config.footerPhotoSrc);
    updatePhotoSlot("footerPhotoImg", config.footerPhotoSrc);

    if (config.albumPhotos && Array.isArray(config.albumPhotos)) {
      config.albumPhotos.forEach((src, idx) => {
        const albumImg = document.getElementById(`albumImg${idx + 1}`);
        const parentItem = albumImg ? albumImg.closest(".album-grid-item") : null;
        if (albumImg) {
          if (src && typeof src === "string" && src.trim() !== "" && !src.includes("assets/images/")) {
            albumImg.src = src.trim();
            albumImg.style.display = "block";
            albumImg.classList.remove("img-load-error");
            if (parentItem) {
              parentItem.setAttribute("data-full", src.trim());
              parentItem.classList.add("has-image");
              parentItem.classList.remove("no-image");
            }
          } else {
            albumImg.removeAttribute("src");
            albumImg.style.display = "none";
            if (parentItem) {
              parentItem.removeAttribute("data-full");
              parentItem.classList.remove("has-image");
              parentItem.classList.add("no-image");
            }
          }
        }
      });
    }

    // Tạo mã QR cho cột máy tính mở trên điện thoại
    const desktopQr = document.getElementById("desktopQrImg");
    if (desktopQr) {
      const pageUrl = window.location.href;
      desktopQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pageUrl)}`;
    }
  }

  applyConfigToUI();

  // 4. Khởi tạo Lịch tháng 11 với Trái tim viền đỏ (Calendar)
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
      cell.textContent = "";
      grid.appendChild(cell);
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cell = document.createElement("div");
      cell.className = "cal-date-cell";

      if (day === targetDay) {
        cell.classList.add("event-date");
        cell.innerHTML = `
          <img src="assets/images/heart.svg" class="heart-marker" alt="Event Date Heart" />
          <span>${day}</span>
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
      cell.className = "cal-date-cell empty";
      cell.textContent = "";
      grid.appendChild(cell);
    }
  }

  renderCalendar();

  // 5. Thêm sự kiện vào Google Calendar
  const addToCalendarBtn = document.getElementById("addToCalendarBtn");
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener("click", () => {
      const title = encodeURIComponent(`Lễ Tốt Nghiệp của ${config.graduateName || "Phạm Thị Kim Huê"}`);
      const details = encodeURIComponent(`Trân trọng kính mời bạn đến tham dự và chung vui trong ngày tốt nghiệp trọng đại!`);
      const location = encodeURIComponent(config.locationAddress || "Số 2 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP.HCM");

      const startDate = new Date(config.targetDate || "2026-11-17T10:00:00");
      const endDate = new Date(startDate.getTime() + (4 * 60 * 60 * 1000));

      const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      const dates = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
      window.open(gcalUrl, "_blank");
    });
  }

  // 6. Đồng hồ Đếm ngược Thời gian thực (Real-time Countdown)
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

  // 7. Nhạc nền và Bộ điều khiển âm thanh (Đồng bộ Di động & Máy tính)
  const bgMusic = document.getElementById("bgMusic");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const desktopMusicBtn = document.getElementById("desktopMusicBtn");
  const desktopVinylDisc = document.getElementById("desktopVinylDisc");
  const desktopPlayIcon = document.getElementById("desktopPlayIcon");
  const desktopPlayText = document.getElementById("desktopPlayText");
  let isPlaying = false;

  function setPlayingState(playing) {
    isPlaying = playing;

    // Nút nổi di động
    if (musicToggleBtn) {
      if (playing) {
        musicToggleBtn.classList.add("playing");
        const waves = document.getElementById("soundWaves");
        if (waves) waves.style.display = "flex";
      } else {
        musicToggleBtn.classList.remove("playing");
        const waves = document.getElementById("soundWaves");
        if (waves) waves.style.display = "none";
      }
    }

    // Đĩa than & nút trên máy tính
    if (desktopVinylDisc) {
      if (playing) {
        desktopVinylDisc.classList.add("playing");
      } else {
        desktopVinylDisc.classList.remove("playing");
      }
    }

    if (desktopPlayIcon && desktopPlayText) {
      if (playing) {
        desktopPlayIcon.textContent = "⏸";
        desktopPlayText.textContent = "TẠM DỪNG";
      } else {
        desktopPlayIcon.textContent = "▶";
        desktopPlayText.textContent = "BẬT NHẠC";
      }
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

  // Nút di động
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

  // Nút máy tính
  if (desktopMusicBtn) {
    desktopMusicBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!bgMusic) return;
      if (bgMusic.paused) {
        startAudio().catch(err => console.warn("Lỗi phát nhạc:", err));
      } else {
        stopAudio();
      }
    });
  }

  // Nút cuộn nhanh tới RSVP trên máy tính
  const desktopScrollRsvpBtn = document.getElementById("desktopScrollRsvpBtn");
  if (desktopScrollRsvpBtn) {
    desktopScrollRsvpBtn.addEventListener("click", () => {
      const rsvpSec = document.getElementById("rsvpSection");
      if (rsvpSec) {
        rsvpSec.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  const onFirstUserGesture = (e) => {
    if (musicToggleBtn && (e.target === musicToggleBtn || musicToggleBtn.contains(e.target))) return;
    if (desktopMusicBtn && (e.target === desktopMusicBtn || desktopMusicBtn.contains(e.target))) return;
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

  // 8. Xử lý mở thiệp 2 cánh kiểu cửa (Interactive Gatefold Opening)
  function initGatefoldOpening() {
    const envelopeOverlay = document.getElementById("envelopeOverlay");
    const gatefoldSeal = document.getElementById("gatefoldSeal");
    if (!envelopeOverlay) return;

    let isOpened = false;

    const handleOpen = () => {
      if (isOpened) return;
      isOpened = true;

      startAudio().catch(() => {});

      if (typeof confetti === "function") {
        confetti({
          particleCount: 65,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#cba248', '#851c27', '#ffd700', '#fcebbb', '#ffffff']
        });
        setTimeout(() => {
          confetti({
            particleCount: 40,
            angle: 60,
            spread: 50,
            origin: { x: 0 },
            colors: ['#cba248', '#851c27', '#ffd700']
          });
          confetti({
            particleCount: 40,
            angle: 120,
            spread: 50,
            origin: { x: 1 },
            colors: ['#cba248', '#851c27', '#ffd700']
          });
        }, 300);
      }

      envelopeOverlay.classList.add("opened");
      setTimeout(() => {
        envelopeOverlay.style.display = "none";
      }, 1200);
    };

    if (gatefoldSeal) {
      gatefoldSeal.addEventListener("click", handleOpen);
    }
    envelopeOverlay.addEventListener("click", handleOpen);
  }

  initGatefoldOpening();

  // 9. Hệ thống Hiệu Ứng Chữ Khi Cuộn Trang (Scroll Reveal Engine)
  function initTextAnimations() {
    const revealElements = document.querySelectorAll(
      ".reveal-text, .letter-expand-reveal, .divider-expand, .badge-pop"
    );
    if (!revealElements.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add("is-revealed"));
    }
  }

  initTextAnimations();

  // 10. Sổ lưu bút và Kết nối Đồng bộ Google Sheets
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
      wishEl.className = "wish-item reveal-text is-revealed";

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

  // 11. Xử lý Gửi Form Xác nhận tham dự (RSVP)
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
          colors: ['#cba248', '#851c27', '#ffd700']
        });
      }

      showToast(`Cảm ơn ${name} đã gửi lời chúc yêu thương! 🥰`);
      messageInput.value = "";

      const wishesSec = document.getElementById("wishesSection");
      if (wishesSec) {
        wishesSec.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  // 12. Modal xem ảnh phóng to (Lightbox)
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

  // 13. Thông báo Toast
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

  // 14. Mở bí mật Quản trị: Nhấp 3 lần liên tiếp vào dòng "ktv © 2026"
  const footerCredits = document.querySelectorAll(".footer-credit");
  if (footerCredits.length > 0) {
    let clickCount = 0;
    let clickTimer = null;
    footerCredits.forEach(fc => {
      fc.style.cursor = "pointer";
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
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // 15. Hiệu ứng Cánh hoa và Bụi sao bay lãng mạn
  function initRomanticAtmosphere() {
    const canvas = document.getElementById("fxCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const petals = [];
    const petalColors = [
      "rgba(215, 65, 80, 0.45)",
      "rgba(240, 160, 170, 0.4)",
      "rgba(255, 220, 225, 0.5)",
      "rgba(203, 162, 72, 0.35)"
    ];
    const isMobile = window.innerWidth < 768;
    const petalCount = isMobile ? 12 : 18;

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 7 + 5,
        speedY: Math.random() * 0.7 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01
      });
    }

    const stars = [];
    const starCount = isMobile ? 10 : 16;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.6,
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
        ctx.fillStyle = `rgba(235, 208, 125, ${Math.max(0, Math.min(1, s.alpha))})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(203, 162, 72, 0.4)";
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
