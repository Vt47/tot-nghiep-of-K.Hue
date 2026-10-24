/**
 * MÃ GOOGLE APPS SCRIPT DÀNH CHO THIỆP MỜI TỐT NGHIỆP
 * 
 * HƯỚNG DẪN CÀI ĐẶT TRONG 2 PHÚT:
 * 1. Truy cập https://sheets.new để tạo một trang tính Google mới (đặt tên ví dụ: "Danh sách khách mời tốt nghiệp").
 * 2. Ở hàng đầu tiên (Hàng 1), tạo 4 cột tiêu đề:
 *    - Cột A: Thời gian gửi
 *    - Cột B: Tên khách mời
 *    - Cột C: Xác nhận tham dự
 *    - Cột D: Lời chúc
 * 3. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Xóa hết mã có sẵn trong Apps Script, dán toàn bộ nội dung file này vào.
 * 5. Nhấn "Lưu" (biểu tượng đĩa mềm 💾).
 * 6. Nhấn nút "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Tùy chọn triển khai mới" (New deployment).
 *    - Chọn loại: "Ứng dụng web" (Web app).
 *    - Mô tả: "Lưu thiệp mời tốt nghiệp".
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me).
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone).
 * 7. Nhấn "Triển khai" -> Cho phép cấp quyền (Authorize access) bằng tài khoản Google của bạn.
 * 8. Sao chép "URL ứng dụng web" (có dạng: https://script.google.com/macros/s/.../exec).
 * 9. Dán URL này vào mục "Chỉnh sửa thiệp" trên trang web hoặc vào tệp js/config.js!
 */

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var wishes = [];

    // Bỏ qua hàng tiêu đề (hàng 0), duyệt từ dưới lên trên để lời chúc mới nhất hiển thị đầu tiên
    for (var i = data.length - 1; i >= 1; i--) {
      var row = data[i];
      if (row[1] || row[3]) { // Có tên hoặc lời chúc
        var formattedTime = "Vừa xong";
        if (row[0] instanceof Date) {
          formattedTime = Utilities.formatDate(row[0], "Asia/Ho_Chi_Minh", "HH:mm dd/MM/yyyy");
        } else if (row[0]) {
          formattedTime = row[0].toString();
        }

        wishes.push({
          time: formattedTime,
          name: row[1] ? row[1].toString() : "Khách mời",
          status: row[2] ? row[2].toString() : "Chắc chắn tham dự",
          message: row[3] ? row[3].toString() : ""
        });
      }
    }

    var output = JSON.stringify({ status: "success", wishes: wishes });
    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errorOutput = JSON.stringify({ status: "error", message: error.toString(), wishes: [] });
    return ContentService.createTextOutput(errorOutput).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var postData;

    if (e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        postData = e.parameter;
      }
    } else {
      postData = e.parameter;
    }

    var now = new Date();
    var name = postData.name || "Khách mời";
    var status = postData.status || "Chắc chắn tham dự";
    var message = postData.message || "";

    // Thêm hàng mới vào bảng tính
    sheet.appendRow([now, name, status, message]);

    var result = JSON.stringify({ status: "success", message: "Đã lưu thành công" });
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errorResult = JSON.stringify({ status: "error", message: error.toString() });
    return ContentService.createTextOutput(errorResult).setMimeType(ContentService.MimeType.JSON);
  }
}
