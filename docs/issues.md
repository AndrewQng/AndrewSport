# Nhật Ký Lỗi & Giải Pháp (Issues & Bug Tracking)

Dưới đây là thống kê các vấn đề kỹ thuật phát sinh trong quá trình xây dựng dự án **AndrewSport E-Commerce** và giải pháp xử lý đã áp dụng.

---

## 1. Lỗi Đã Được Khắc Phục (Resolved Issues)

### 1.1 Lỗi Tên Cơ Sở Dữ Liệu MongoDB (Database Name Bug)
- **Vấn đề**: Biến `MONGO_URI` cấu hình trong `.env` không chỉ định rõ tên cơ sở dữ liệu con, dẫn đến việc dữ liệu bị ghi vào database mặc định của MongoDB Atlas thay vì phân tách riêng.
- **Giải pháp**: Bổ sung cấu hình thuộc tính `database: andrewsport` trực tiếp trong file `application.yml` của backend để định hướng ghi dữ liệu đúng đích.

### 1.2 Lỗi Khởi Tạo Sớm Servlet Filter (Eager Context Initialization Bug)
- **Vấn đề**: Lớp `JwtAuthenticationFilter` được đánh dấu là `@Component` khiến Spring Boot khởi tạo quá sớm trong vòng đời ứng dụng. Điều này kéo theo việc các UserRepository/MongoTemplate liên quan bị gọi trước khi cấu hình kết nối DB hoàn tất, gây lỗi crash khởi động.
- **Giải pháp**: Đánh dấu `@Lazy` trên trường `UserDetailsService` được tiêm vào trong lớp Filter, trì hoãn khởi tạo cho đến khi cấu hình database sẵn sàng.

### 1.3 Lỗi Tham Chiếu Vòng Tròn Spring Beans (Circular Reference Bug)
- **Vấn đề**: Lớp `UserServiceImpl` (Triển khai `UserDetailsService`) yêu cầu Bean `AuthenticationManager` để xác thực, trong khi `SecurityConfig` (Bean sinh ra `AuthenticationManager`) lại cần `UserServiceImpl` để cấu hình Authentication Provider, tạo thành vòng lặp tham chiếu khép kín.
- **Giải pháp**: Đánh dấu `@Lazy` trên trường `@Autowired private AuthenticationManager authenticationManager;` bên trong lớp `UserServiceImpl.java` để phá vỡ vòng lặp.

### 1.4 Lỗi Biên Dịch Frontend Thiếu Component (Frontend Compilation Bug)
- **Vấn đề**: Bảng điều khiển `AdminDashboard.jsx` gọi component `<Row>` và `<Col>` nhưng không khai báo import ở đầu file, gây lỗi `ReferenceError: Row is not defined` trên màn hình trình duyệt.
- **Giải pháp**: Bổ sung `Row` và `Col` vào danh sách import các đối tượng UI từ thư viện `antd`.

### 1.5 Lỗi Trùng Lặp Cấu Trúc Bọc Thẻ Radio.Group (Nested Radio.Group Bug)
- **Vấn đề**: File thanh toán `Checkout.jsx` sau khi sửa cấu trúc chứa thẻ `<Radio.Group>` bị lồng lặp vô nghĩa bên trong chính nó, làm sai lệch cấu trúc chọn lựa phương thức thẻ/ví.
- **Giải pháp**: Xóa bỏ cụm thẻ Radio dư thừa, chuẩn hóa lại thẻ lựa chọn về dạng đơn cấp.

### 1.6 Vấn Đề Seeding Cũ Không Tự Cập Nhật
- **Vấn đề**: Khi thay đổi giá tiền từ hệ USD sang hệ VND trong seeder `DataInitializer.java`, do hàm chỉ chạy kiểm tra số lượng bản ghi `count() == 0` nên cơ sở dữ liệu cũ vẫn giữ nguyên các mức giá USD, không cập nhật giá VND mới.
- **Giải pháp**: Bổ sung lệnh `categoryRepository.deleteAll()` và `productRepository.deleteAll()` vào đầu tiến trình khởi chạy seeder để ép buộc làm sạch kho và ghi nhận danh mục/sản phẩm Việt hóa chuẩn VND mới.

### 1.7 Lỗi Thiếu Component Button Trong Trang Chủ (Missing Button Import Bug)
- **Vấn đề**: File trang chủ `Home.jsx` gọi component `<Button>` để điều khiển chuyển động của Carousel Slider nhưng không khai báo import ở đầu file.
- **Giải pháp**: Bổ sung `Button` vào dòng import từ thư viện `antd` ở đầu file `Home.jsx`.

### 1.8 Lỗi Khởi Động Do Tham Chiếu Vòng Tròn Khi Reload (Circular Reference Reload Bug)
- **Vấn đề**: Khi reload hoặc chạy lại backend, Spring Boot 3.x ném lỗi crash do tham chiếu vòng tròn giữa cấu hình bảo mật và dịch vụ người dùng.
- **Giải pháp**: Thêm cấu hình `spring.main.allow-circular-references: true` trong file `application.yml` để cho phép Spring tự động xử lý các tham chiếu vòng.

### 1.9 Lỗi Lệch Thanh Tìm Kiếm (Misaligned Search Bar Bug)
- **Vấn đề**: Việc thiết lập `style={{ borderRadius: '8px' }}` trên thành phần `<Search>` của Ant Design làm biến dạng và lệch nút "Tìm kiếm" so với ô nhập liệu.
- **Giải pháp**: Loại bỏ thuộc tính borderRadius trên thẻ `<Search>`, chuyển quyền xử lý bo góc đồng bộ cho ConfigProvider và CSS chuẩn của Ant Design.

---

## 2. Issues Backlog & Đề Xuất Nâng Cấp (Future Enhancements)

- `[ ]` **Tìm kiếm phân trang (Server-side Pagination)**: Cần nâng cấp tìm kiếm sản phẩm phân trang ở backend để tối ưu hiệu năng khi kho hàng tăng lên hàng ngàn sản phẩm.
- `[ ]` **Tích hợp thanh toán thật (VNPay / Momo Sandbox)**: Thay thế giao diện mô phỏng thanh toán thẻ tín dụng hiện tại bằng việc tích hợp cổng kết nối ví điện tử thực tế của Việt Nam.
- `[ ]` **Bảo mật mật khẩu mạnh**: Cấu hình ràng buộc đăng ký tài khoản yêu cầu độ dài tối thiểu và các ký tự đặc biệt ở cả frontend & backend validator.
