/**
 * ADMIN DASHBOARD SCRIPT
 * Handling Authentication, QR/Link Generation, Card Config & RSVP Wishes
 */

document.addEventListener("DOMContentLoaded", () => {
  const PASSWORD_KEY = "graduation_admin_password";
  const SESSION_KEY = "graduation_admin_session";
  const GUEST_HISTORY_KEY = "graduation_guest_history";
  const DEFAULT_PASSWORD = "123456";

  const config = window.APP_CONFIG || {};

  // 1. Quản lý Đăng Nhập & Mật Khẩu
  const loginScreen = document.getElementById("loginScreen");
  const dashboardScreen = document.getElementById("dashboardScreen");
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("passwordInput");
  const togglePasswordBtn = document.getElementById("togglePasswordBtn");
  const loginError = document.getElementById("loginError");
  const logoutBtn = document.getElementById("logoutBtn");

  function getStoredPassword() {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  }

  function checkSession() {
    const isAuth = sessionStorage.getItem(SESSION_KEY) === "true";
    if (isAuth) {
      loginScreen.style.display = "none";
      dashboardScreen.style.display = "block";
      initDashboard();
    } else {
      loginScreen.style.display = "flex";
      dashboardScreen.style.display = "none";
      if (passwordInput) passwordInput.focus();
    }
  }

  // Hiện/Ẩn mật khẩu
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isPwd = passwordInput.type === "password";
      passwordInput.type = isPwd ? "text" : "password";
      togglePasswordBtn.textContent = isPwd ? "🙈" : "👁️";
    });
  }

  // Xử lý nộp form đăng nhập
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = passwordInput.value.trim();
      const currentPwd = getStoredPassword();

      if (entered === currentPwd) {
        sessionStorage.setItem(SESSION_KEY, "true");
        loginError.style.display = "none";
        showToast("Đăng nhập thành công! Chào mừng chủ thiệp 🎓");
        checkSession();
      } else {
        loginError.style.display = "block";
        passwordInput.select();
      }
    });
  }

  // Đăng xuất
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      showToast("Đã đăng xuất khỏi tài khoản admin!");
      checkSession();
    });
  }

  // 2. Chuyển đổi các Tab
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      navTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // 3. Khởi tạo Bảng Điều Khiển
  function initDashboard() {
    const currentConfig = window.APP_CONFIG || {};
    const adminGradDisplay = document.getElementById("adminGradNameDisplay");
    if (adminGradDisplay) {
      adminGradDisplay.textContent = `Lễ Tốt Nghiệp của ${currentConfig.graduateName || "Lê Minh Thư"}`;
    }

    initQrGenerator();
    initEditCardForm();
    initWishesManager();
    initSecuritySettings();
  }

  // ==========================================================================
  // TAB 1: TẠO LINK MỜI & MÃ QR
  // ==========================================================================
  function initQrGenerator() {
    const guestInput = document.getElementById("guestNameInput");
    const linkOutput = document.getElementById("fullLinkOutput");
    const previewBtn = document.getElementById("previewLinkBtn");
    const qrImg = document.getElementById("qrPreviewImg");
    const qrNameCaption = document.getElementById("qrNameCaption");
    const copyLinkBtn = document.getElementById("copyLinkBtn");
    const downloadQrBtn = document.getElementById("downloadQrBtn");
    const saveHistoryBtn = document.getElementById("saveGuestHistoryBtn");

    function getBaseUrl() {
      return window.location.origin + "/";
    }

    function updatePreview() {
      const rawName = guestInput.value.trim();
      const base = getBaseUrl();
      let fullUrl = base;

      if (rawName) {
        fullUrl = `${base}?to=${encodeURIComponent(rawName)}`;
        linkOutput.textContent = fullUrl;
        previewBtn.href = fullUrl;
        qrNameCaption.textContent = `Mã QR cho: ${rawName}`;
      } else {
        linkOutput.textContent = base;
        previewBtn.href = base;
        qrNameCaption.textContent = "Mã QR thiệp mời chung";
      }

      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}&margin=12`;
      }
    }

    if (guestInput) {
      guestInput.addEventListener("input", updatePreview);
      updatePreview();
    }

    // Sao chép link
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        const text = linkOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
          showToast("Đã sao chép link mời vào bộ nhớ tạm! 📋");
        }).catch(() => {
          const temp = document.createElement("textarea");
          temp.value = text;
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
          showToast("Đã sao chép link mời! 📋");
        });
      });
    }

    // Tải mã QR
    if (downloadQrBtn) {
      downloadQrBtn.addEventListener("click", async () => {
        if (!qrImg || !qrImg.src) return;
        const rawName = guestInput.value.trim() || "khach-moi";
        const fileName = `thiep-moi-${rawName.toLowerCase().replace(/\s+/g, "-")}-qr.png`;

        showToast("Đang tải ảnh mã QR xuống... ⏳");
        try {
          const res = await fetch(qrImg.src);
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
          showToast("Đã tải mã QR về máy thành công! 📥");
        } catch (e) {
          window.open(qrImg.src, "_blank");
        }
      });
    }

    // Lưu vào lịch sử
    if (saveHistoryBtn) {
      saveHistoryBtn.addEventListener("click", () => {
        const rawName = guestInput.value.trim();
        if (!rawName) {
          showToast("Vui lòng nhập tên khách mời trước khi lưu!");
          return;
        }
        addGuestToHistory(rawName, linkOutput.textContent);
        guestInput.value = "";
        updatePreview();
        showToast(`Đã lưu "${rawName}" vào danh sách! 💾`);
      });
    }

    renderGuestHistory();
  }

  // Quản lý lịch sử khách đã tạo mã
  function getGuestHistory() {
    try {
      const data = localStorage.getItem(GUEST_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function addGuestToHistory(name, url) {
    const list = getGuestHistory();
    // Đưa lên đầu danh sách, tránh trùng lặp
    const filtered = list.filter(item => item.name.toLowerCase() !== name.toLowerCase());
    filtered.unshift({
      name,
      url,
      time: new Date().toLocaleDateString("vi-VN")
    });
    localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(filtered));
    renderGuestHistory();
  }

  function renderGuestHistory() {
    const list = getGuestHistory();
    const countEl = document.getElementById("guestCount");
    const container = document.getElementById("guestHistoryList");
    if (countEl) countEl.textContent = list.length;
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; color: var(--color-muted); font-size: 13px; text-align: center; padding: 18px;">Chưa có khách mời nào được lưu. Hãy nhập tên ở trên và bấm "Lưu vào danh sách"!</div>`;
      return;
    }

    container.innerHTML = list.map((item, idx) => `
      <div class="guest-history-item">
        <div class="guest-item-name">${escapeHTML(item.name)}</div>
        <div class="guest-item-actions">
          <button class="mini-btn" onclick="window.copyHistoryLink('${escapeHTML(item.url)}')">📋 Copy</button>
          <a class="mini-btn" href="${escapeHTML(item.url)}" target="_blank">👀 Xem</a>
          <button class="mini-btn" style="color: #c81e1e;" onclick="window.deleteHistoryItem(${idx})">✕</button>
        </div>
      </div>
    `).join("");
  }

  window.copyHistoryLink = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showToast("Đã sao chép link mời! 📋");
    });
  };

  window.deleteHistoryItem = (idx) => {
    const list = getGuestHistory();
    list.splice(idx, 1);
    localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(list));
    renderGuestHistory();
  };

  const clearHistoryBtn = document.getElementById("clearHistoryBtn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa tất cả lịch sử khách đã lưu?")) {
        localStorage.removeItem(GUEST_HISTORY_KEY);
        renderGuestHistory();
        showToast("Đã xóa sạch danh sách khách mời!");
      }
    });
  }

  // ==========================================================================
  // TAB 2: CHỈNH SỬA THIỆP MỜI
  // ==========================================================================
  function initEditCardForm() {
    const form = document.getElementById("editInvitationForm");
    const cur = window.APP_CONFIG || {};

    const editGrad = document.getElementById("editGradName");
    const editSub = document.getElementById("editSubtitle");
    const editDay = document.getElementById("editEventDay");
    const editMonth = document.getElementById("editEventMonth");
    const editYear = document.getElementById("editEventYear");
    const editDateTime = document.getElementById("editDateTime");
    const editLocation = document.getElementById("editLocation");
    const editMaps = document.getElementById("editMapsUrl");
    const editThank = document.getElementById("editThankYou");
    const resetBtn = document.getElementById("resetDefaultBtn");

    if (editGrad) editGrad.value = cur.graduateName || "LÊ MINH THƯ";
    if (editSub) editSub.value = cur.subtitle || "LỄ TỐT NGHIỆP CỦA";
    if (editDay) editDay.value = cur.eventDay || 17;
    if (editMonth) editMonth.value = cur.calendarMonth || 11;
    if (editYear) editYear.value = cur.calendarYear || 2026;
    if (editDateTime) editDateTime.value = cur.displayDateTime || "17/11/2026 | Lúc 10h - 14h";
    if (editLocation) editLocation.value = cur.locationAddress || "Số 2 , Hoàng Văn Thụ, P 4, Q.Tân Bình, TP HCM";
    if (editMaps) editMaps.value = cur.googleMapsUrl || "";
    if (editThank) editThank.value = cur.thankYouMessage || "";

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const updated = {
          ...cur,
          graduateName: editGrad.value.trim(),
          subtitle: editSub.value.trim(),
          eventDay: parseInt(editDay.value, 10) || 17,
          calendarMonth: parseInt(editMonth.value, 10) || 11,
          calendarYear: parseInt(editYear.value, 10) || 2026,
          displayDateTime: editDateTime.value.trim(),
          locationAddress: editLocation.value.trim(),
          googleMapsUrl: editMaps.value.trim(),
          googleMapsEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(editLocation.value.trim())}&t=&z=15&ie=UTF8&iwloc=&output=embed`,
          thankYouMessage: editThank.value.trim()
        };

        localStorage.setItem("graduation_invitation_config", JSON.stringify(updated));
        window.APP_CONFIG = updated;
        showToast("Đã lưu thông tin thiệp thành công! 🎉");
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Khôi phục toàn bộ thông tin thiệp về mặc định ban đầu?")) {
          localStorage.removeItem("graduation_invitation_config");
          location.reload();
        }
      });
    }
  }

  // ==========================================================================
  // TAB 3: QUẢN LÝ LỜI CHÚC & RSVP
  // ==========================================================================
  function initWishesManager() {
    const WISHES_STORAGE_KEY = "graduation_invitation_wishes_list";
    let wishes = [];

    try {
      const stored = localStorage.getItem(WISHES_STORAGE_KEY);
      if (stored) wishes = JSON.parse(stored);
    } catch (e) {}

    if (wishes.length === 0 && config.initialWishes) {
      wishes = config.initialWishes;
    }

    // Đếm thống kê
    let yes = 0, maybe = 0, no = 0;
    wishes.forEach(w => {
      const st = (w.status || "").toLowerCase();
      if (st.includes("chắc chắn") || st.includes("tham dự")) yes++;
      else if (st.includes("cố gắng") || st.includes("sắp xếp")) maybe++;
      else no++;
    });

    const statTotal = document.getElementById("statTotal");
    const statYes = document.getElementById("statYes");
    const statMaybe = document.getElementById("statMaybe");
    const statNo = document.getElementById("statNo");

    if (statTotal) statTotal.textContent = wishes.length;
    if (statYes) statYes.textContent = yes;
    if (statMaybe) statMaybe.textContent = maybe;
    if (statNo) statNo.textContent = no;

    const tbody = document.getElementById("wishesTableBody");
    if (!tbody) return;

    if (wishes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="empty-cell">Chưa có lời chúc nào được gửi.</td></tr>`;
      return;
    }

    tbody.innerHTML = wishes.map(w => `
      <tr>
        <td><strong>${escapeHTML(w.name || "Ẩn danh")}</strong></td>
        <td><span class="badge ${getStatusClass(w.status)}">${escapeHTML(w.status || "Chưa chọn")}</span></td>
        <td>${escapeHTML(w.message || "")}</td>
        <td style="color: var(--color-muted); font-size: 12px; white-space: nowrap;">${escapeHTML(w.time || "Gần đây")}</td>
      </tr>
    `).join("");
  }

  function getStatusClass(status) {
    const s = (status || "").toLowerCase();
    if (s.includes("chắc chắn")) return "badge-yes";
    if (s.includes("cố gắng")) return "badge-maybe";
    return "badge-no";
  }

  // ==========================================================================
  // TAB 4: ĐỔI MẬT KHẨU
  // ==========================================================================
  function initSecuritySettings() {
    const pwdForm = document.getElementById("changePasswordForm");
    const currentPwdInput = document.getElementById("currentPwd");
    const newPwdInput = document.getElementById("newPwd");
    const confirmPwdInput = document.getElementById("confirmPwd");

    if (pwdForm) {
      pwdForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentStored = getStoredPassword();
        const enteredCurrent = currentPwdInput.value.trim();
        const enteredNew = newPwdInput.value.trim();
        const enteredConfirm = confirmPwdInput.value.trim();

        if (enteredCurrent !== currentStored) {
          showToast("Mật khẩu hiện tại không đúng!");
          currentPwdInput.focus();
          return;
        }

        if (enteredNew !== enteredConfirm) {
          showToast("Mật khẩu xác nhận không khớp!");
          confirmPwdInput.focus();
          return;
        }

        if (enteredNew.length < 4) {
          showToast("Mật khẩu mới phải có ít nhất 4 ký tự!");
          return;
        }

        localStorage.setItem(PASSWORD_KEY, enteredNew);
        pwdForm.reset();
        showToast("Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới nhé 🔐");
      });
    }
  }

  // Toast thông báo
  function showToast(text) {
    const toast = document.getElementById("adminToast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str).replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  checkSession();
});
