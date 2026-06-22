# Cấu Trúc Dự Án (Project Structure)

Dự án **AndrewSport E-Commerce** được thiết kế theo kiến trúc nguyên khối (Monolith Clean Architecture), tách biệt rõ ràng giữa phần Backend (Spring Boot + MongoDB) và Frontend (Vite + ReactJS + Ant Design).

---

## 1. Tổng Quan Cây Thư Mục

```text
D:\Personal_Projects\E-commerce website
├── backend/                  # Mã nguồn Spring Boot Java
│   ├── pom.xml               # Quản lý thư viện Maven
│   └── src/
│       └── main/
│           ├── java/com/andrewsport/ecommerce/
│           │   ├── EcommerceApplication.java     # Lớp khởi chạy ứng dụng
│           │   ├── config/                       # Cấu hình bảo mật & JWT
│           │   ├── controller/                   # Các REST API Controllers
│           │   ├── dto/                          # Lớp truyền tải dữ liệu
│           │   ├── model/                        # Thực thể DB (MongoDB Documents)
│           │   ├── repository/                   # Giao tiếp cơ sở dữ liệu
│           │   ├── service/                      # Logic nghiệp vụ chi tiết
│           │   └── loader/                       # Tải & Seeding dữ liệu ban đầu
│           └── resources/
│               └── application.yml               # Cấu hình môi trường chính
├── frontend/                 # Mã nguồn ReactJS
│   ├── package.json          # Quản lý gói Node.js
│   ├── vite.config.js        # Cấu hình đóng gói Vite
│   ├── index.html            # File HTML chính
│   └── src/
│       ├── App.jsx           # Phân tuyến trang & Quản lý giỏ hàng/thành viên
│       ├── index.css         # CSS tùy biến giao diện toàn cục
│       ├── main.jsx          # Điểm gắn kết DOM của React
│       ├── services/
│       │   └── api.js        # Cấu hình Axios & Tự động đính kèm Token JWT
│       ├── components/       # Các thành phần tái sử dụng
│       │   ├── Navbar.jsx    # Header hai tầng & Mega Menu
│       │   ├── ProductCard.jsx
│       │   └── ChatbotDrawer.jsx
│       └── pages/            # Các trang giao diện chính
│           ├── Home.jsx      # Trang chủ & Lọc sản phẩm
│           ├── ProductDetail.jsx # Trang chi tiết & Đặc tả thông số
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Cart.jsx
│           ├── Checkout.jsx
│           ├── OrderHistory.jsx
│           └── AdminDashboard.jsx
├── docs/                     # Tài liệu kỹ thuật dự án
│   ├── structure.md
│   ├── issues.md
│   └── tracking.md
├── .env                      # Lưu trữ biến môi trường bảo mật
└── .gitignore                # Khai báo loại bỏ file đẩy lên Git
```

---

## 2. Chi Tiết Các Phân Hệ

### 2.1 Backend (Java Spring Boot)
- **MVC & Clean Architecture Pattern**:
  - `Model`: Định nghĩa cấu trúc lưu trữ MongoDB bằng chú thích `@Document`.
  - `Repository`: Kế thừa `MongoRepository` để thực hiện truy vấn DB.
  - `Service`: Chứa các quy tắc nghiệp vụ logic, tính toán hóa đơn, điều hướng hội thoại GPT, kiểm kho.
  - `Controller`: Định nghĩa REST Endpoints truy xuất JSON, phân cấp quyền.
- **Security & Authorization**:
  - Tích hợp Spring Security với phương thức stateless thông qua Token JWT.
  - Phân quyền rõ ràng giữa `USER` (Thành viên mua hàng) và `ADMIN` (Quản trị kho/đơn hàng).

### 2.2 Frontend (React + Ant Design)
- **Component-driven & Theme Configuration**:
  - Quản lý theme đồng bộ bằng `ConfigProvider` của Ant Design để định màu thương hiệu cam VNB (`#E95211`).
  - Phân vùng chức năng giữa `pages` (trang phân tuyến độc lập) và `components` (các khối UI rời).
  - Tích hợp chatbot thông minh hỗ trợ khách hàng đặt câu hỏi về trang thiết bị thể thao.

---

## 3. Kiến Trúc & Các Mẫu Thiết Kế (Architecture & Design Patterns)

Dự án áp dụng các nguyên lý kiến trúc và mẫu thiết kế chuẩn của hệ sinh thái Spring Boot để giữ mã nguồn dễ hiểu, mở rộng và bảo trì:

*   **Kiến trúc Phân lớp (Layered Architecture)**: Tách biệt mã nguồn backend thành 4 tầng chức năng:
    *   **Presentation Layer (API Controller)**: Tiếp nhận các yêu cầu HTTP, kiểm tra hợp lệ dữ liệu cơ bản và điều phối luồng xử lý thông qua DTO.
    *   **Business Logic Layer (Service)**: Xử lý các quy tắc nghiệp vụ, giao tiếp với API bên ngoài (OpenAI API), và quản lý giao dịch.
    *   **Data Access Layer (Repository)**: Định nghĩa các interface giao tiếp DB.
    *   **Data Model Layer (Entity/Model)**: Đại diện cho cấu trúc dữ liệu lưu trữ trong MongoDB.
*   **Dependency Injection (DI) & Inversion of Control (IoC)**: Toàn bộ các Service, Repository, và Config đều được Spring Container quản lý vòng đời (Spring Beans). Việc tiêm phụ thuộc thông qua chú thích `@Autowired` giúp giảm thiểu sự liên kết cứng (coupling), tăng khả năng tái sử dụng và dễ dàng làm mock khi viết Unit Test.
*   **Service & Service Implementation Pattern**: Sử dụng Interface để định nghĩa hợp đồng nghiệp vụ (ví dụ: `OrderService`) và lớp Implementation (`OrderServiceImpl`) để thực thi cụ thể. Cơ chế này che giấu chi tiết triển khai và cho phép thay đổi logic nghiệp vụ mà không ảnh hưởng tới API Controller.
*   **Repository Pattern**: Tách biệt hoàn toàn phần logic nghiệp vụ khỏi phần truy xuất dữ liệu vật lý. Sử dụng `MongoRepository` cung cấp sẵn các thao tác CRUD và Query Methods mà không cần viết mã truy vấn thô (raw query).
*   **Data Transfer Object (DTO) Pattern**: Sử dụng các lớp DTO riêng biệt (như `RegisterRequest`, `VerifyOtpRequest`, `AuthResponse`) để ánh xạ dữ liệu gửi đi/nhận về. Giúp ẩn cấu trúc thực thể DB (`User`), bảo vệ thông tin nhạy cảm và tối ưu lượng băng thông truyền tải.
*   **Fallback Pattern (Cơ chế dự phòng)**: Áp dụng trong `ChatService`. Khi gọi API OpenAI (ChatGPT) gặp lỗi kết nối hoặc thiếu cấu hình API Key, hệ thống tự động chuyển sang chế độ dự phòng cục bộ (rule-based local chatbot) bằng các luật so khớp từ khóa để hệ thống không bao giờ bị gián đoạn hoạt động.
*   **Singleton Pattern**: Mặc định, mọi Spring Bean (Controller, Service, Repository) đều được khởi tạo như một đối tượng duy nhất (Singleton) trong toàn bộ vòng đời của ứng dụng, giúp tiết kiệm bộ nhớ và tài nguyên hệ thống.

---

## 4. Các Kỹ Thuật Áp Dụng (Applied Technical Practices)

*   **Xác thực Phi trạng thái (Stateless JWT Authentication)**: Tích hợp Spring Security kết hợp với Token JWT. Server không duy trì Session, thông tin người dùng và quyền hạn (`USER`/`ADMIN`) được mã hóa trong Token gửi kèm tự động qua HTTP-Only Cookie (`accessToken`) từ trình duyệt để chống tấn công XSS.
*   **MongoDB Multi-Document Transaction**: Khai báo `MongoTransactionManager` để điều phối hoạt động ghi đồng thời lên nhiều collection khác nhau (như trừ kho và tạo đơn hàng). Tận dụng chú thích `@Transactional` để tự động Rollback khi xảy ra lỗi ngoài ý muốn.
*   **Xóa mềm (Soft Delete)**: Nghiệp vụ xóa sản phẩm (`deleteProduct`) chỉ cập nhật trạng thái `status = "DELETED"`. Việc này đảm bảo tính nhất quán dữ liệu lịch sử cho các đơn hàng đã đặt sản phẩm đó trong quá khứ.
*   **Tự động Khởi tạo Dữ liệu (Auto Data Seeding)**: Sử dụng lớp `DataInitializer` (kế thừa `CommandLineRunner`) để tự động kiểm tra cơ sở dữ liệu khi ứng dụng khởi chạy. Nếu chưa có dữ liệu, hệ thống tự tạo sẵn các danh mục sản phẩm, nạp hàng loạt sản phẩm mẫu cùng tài khoản quản trị để nhà phát triển có thể trải nghiệm ngay lập tức.
*   **Bảo mật OTP & Hết Hạn Bản Ghi**: Cơ chế gửi OTP qua email bằng `JavaMailSender`. Các mã xác thực được cấu hình thời gian hết hạn cụ thể (5 phút) và được lưu trữ ngắn hạn trong collection `otp_verifications` trước khi tự hủy sau khi xác thực thành công.
*   **Custom Security Filter Chain**: Cấu hình bộ lọc tùy chỉnh `JwtAuthenticationFilter` xen vào vòng đời lọc của Spring Security để kiểm tra chữ ký và tính hợp lệ của Token trước khi cho phép truy cập tài cập nguyên bảo mật.
