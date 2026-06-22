# Theo Dõi Tiến Độ (Project Tracking & Features status)

Tiến trình triển khai các chức năng nghiệp vụ của dự án **AndrewSport E-Commerce** được cập nhật và kiểm soát tại đây.

---

## 1. Trạng Thái Tính Năng (Feature Status Map)

### 1.1 Quản lý Người Dùng & Bảo Mật (User & Security)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] Đăng ký thành viên mới lưu mã hóa mật khẩu BCrypt vào MongoDB.
  - [x] Đăng nhập nhận JWT Token, xác thực người dùng hoạt động qua `/auth/me`.
  - [x] Phân quyền các tác vụ cấu hình kho hàng chỉ Admin được phép truy cập.

### 1.2 Danh Mục & Sản Phẩm (Catalog & Products)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] Tìm kiếm nhanh sản phẩm qua thanh tìm kiếm ở Header.
  - [x] Lọc theo 3 nhóm thể thao chính: Cầu lông, Tennis, Pickleball.
  - [x] Lọc nâng cao theo thương hiệu (Yonex, Victor, Lining, VS, Mizuno, Apacs, Wilson, Babolat, Joola, Selkirk, Asics) từ Mega Menu.
  - [x] Sắp xếp giá tăng dần / giảm dần.
  - [x] Hiển thị thông số chi tiết chuẩn của sản phẩm trực tiếp từ cơ sở dữ liệu (ví dụ: Yonex Astrox 99 Pro hiển thị 3U, G5, nặng đầu, cứng, công nghệ 2G-Namd).
  - [x] Tích hợp bộ lọc Accordion nâng cao ở cột trái trang danh mục (giá cả, thương hiệu, Swingweight, trọng lượng, điểm cân bằng, độ cứng đũa, lối chơi, trình độ, công nghệ) đồng bộ với thuộc tính sản phẩm từ database.

### 1.3 Giỏ Hàng & Mua Sắm (Shopping Cart & Order Session)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] Lưu trữ giỏ hàng tự động vào `localStorage` của trình duyệt để duy trì trạng thái khi tải lại trang.
  - [x] Thêm sản phẩm trực tiếp từ trang danh sách hoặc tùy chỉnh số lượng trước khi thêm trong trang chi tiết.
  - [x] Tăng/giảm số lượng và xóa sản phẩm trong giao diện giỏ hàng.
  - [x] Kiểm soát số lượng mua không vượt quá tồn kho thực tế.

### 1.4 Quy Trình Thanh Toán (Checkout & Orders Workflow)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] Phân tích hóa đơn, tự động miễn phí vận chuyển cho đơn hàng.
  - [x] Điền thông tin giao hàng tiếng Việt (Họ tên, Địa chỉ, Thành phố, Điện thoại).
  - [x] Chọn phương thức thanh toán mô phỏng (Thẻ quốc tế 16 số hoặc ID Ví điện tử).
  - [x] Kiểm kho trước khi trừ số lượng sản phẩm mua và tạo hóa đơn lưu vào MongoDB.
  - [x] Kết thúc thanh toán tự động dọn sạch giỏ hàng và đưa về trang thông báo kèm mã vận đơn.

### 1.5 Bảng Quản Trị Hệ Thống (Admin Panel)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] CRUD sản phẩm (Thêm mới, sửa giá/kho/thương hiệu, khóa hoạt động, xóa sản phẩm).
  - [x] Quản lý và theo dõi toàn bộ đơn hàng của các khách hàng trên hệ thống.
  - [x] Cập nhật trạng thái đơn hàng (Đang xử lý -> Đang giao -> Đã giao / Đã hủy) để đồng bộ trạng thái tài khoản người dùng.

### 1.6 Trợ Lý Tư Vấn Thể Thao (ChatGPT Assistant)
- **Tình trạng**: `Hoàn Thành`
- **Đã kiểm thử**:
  - [x] Tích hợp hộp thoại tư vấn góc phải màn hình.
  - [x] Điều phối yêu cầu qua hệ thống API của backend kết nối OpenAI.
  - [x] Cơ chế dự phòng thông minh (Offline Fallback) trả lời danh sách vợt có sẵn nếu không cấu hình khóa API OpenAI Key.

---

## 2. Kế Hoạch Kiểm Thử Định Kỳ (Validation Schedule)

Mỗi khi thay đổi mã nguồn, cần thực hiện tuần tự các bước kiểm thử sau:
1. **Kiểm tra biên dịch**: Đảm bảo dự án frontend (`npm run build`) và backend build thành công.
2. **Kiểm tra seeding**: Xóa toàn bộ dữ liệu trong MongoDB, khởi chạy lại ứng dụng để xác nhận seeding dữ liệu tiếng Việt hoạt động trơn tru.
3. **Luồng người dùng**: Đăng ký -> Chọn sản phẩm -> Xem chi tiết -> Đặt hàng -> Xem lịch sử.
4. **Luồng quản trị**: Admin đăng nhập -> Cập nhật kho -> Giao đơn hàng -> Kiểm tra trạng thái bên giao diện người dùng.
