# 🏓 AndrewSport - Cửa Hàng Dụng Cụ Thể Thao Cao Cấp 🎾

AndrewSport là một ứng dụng thương mại điện tử chuyên nghiệp cung cấp vợt, giày, quần áo và phụ kiện thể thao cao cấp cho các bộ môn Cầu lông, Quần vợt (Tennis) và Pickleball. Hệ thống được xây dựng trên mô hình Monolith hiện đại, kết hợp sức mạnh xử lý của Spring Boot (Backend) và trải nghiệm người dùng mượt mà từ React SPA (Frontend).

---

## 🛠️ Công Nghệ Sử Dụng (Technology Stack)

### 1. Backend (Spring Boot 3.2.5)
- **Java 17 / JDK 17+** làm ngôn ngữ lập trình chính.
- **Spring Security** bảo mật đa tầng, phân quyền vai trò (Admin & User).
- **JWT (JSON Web Token)** để chứng thực không trạng thái (stateless) kết hợp cơ chế Refresh Token kéo dài phiên đăng nhập.
- **Spring Data MongoDB** kết nối cơ sở dữ liệu NoSQL lưu trữ dữ liệu sản phẩm đa thông số và quản lý đơn hàng.
- **Spring Boot Mail** hỗ trợ gửi email mã OTP đăng ký và lấy lại mật khẩu.

### 2. Frontend (React 18 & Vite)
- **Vite** làm công cụ build nhanh và nhẹ.
- **Ant Design (v5.17)** làm hệ thống giao diện UI Component cao cấp.
- **Axios** kết nối API đồng bộ, tự động xử lý refresh token thông qua Interceptor khi access token hết hạn.
- **React Router (v7)** quản lý điều hướng trang nhanh chóng.

---

## 🚀 Các Tính Năng Nổi Bật (Key Features)

### 1. 📧 Xác Minh OTP Qua Gmail (Đăng ký & Quên mật khẩu)
- **Đăng ký an toàn**: Người dùng bắt buộc phải điền địa chỉ email thật để nhận mã OTP gồm 6 chữ số. Mã có hiệu lực trong 5 phút. Xác thực thành công mới được tạo tài khoản trong hệ thống.
- **Khôi phục mật khẩu**: Gửi mã OTP về email để xác minh quyền sở hữu tài khoản, sau đó cho phép đặt lại mật khẩu mới được mã hóa bằng `BCrypt`.
- **💡 Tính Năng SMTP Fallback (Dành cho Dev)**: Nếu hệ thống chưa được cấu hình tài khoản SMTP thật (trong file `.env` hoặc `application.yml`), EmailService sẽ **tự động in mã OTP trực tiếp ra Console của Spring Boot**. Developer chỉ cần copy mã này từ console để kiểm thử mà không cần cài đặt email thật.

### 2. 🔑 Đăng Nhập Mạng Xã Hội Google & Facebook
- **Tích hợp nút Social**: Nút đăng nhập Google và Facebook thiết kế sang trọng đặt ngay dưới form đăng nhập.
- **OAuth Consent Simulator**: Trong môi trường phát triển (chưa cấu hình Client ID thật), khi bấm vào nút Google/Facebook, một cửa sổ popup giả lập (Consent Screen) tinh tế hiển thị cho phép chọn nhanh các tài khoản test (`Nguyễn Văn A`, `Trần Thị B`) hoặc tự nhập tài khoản tùy ý.
- **Tự động liên kết**: Backend tự động phát hiện email từ social login. Nếu email đã tồn tại, tài khoản sẽ được tự động liên kết với Social ID. Nếu chưa tồn tại, hệ thống tự động đăng ký tài khoản mới với mật khẩu ngẫu nhiên an toàn.

### 3. 🤖 Trợ Lý AI Chatbot Thông Minh
- Tích hợp chatbot hỗ trợ khách hàng trả lời hoàn toàn bằng **Tiếng Việt**.
- Chatbot sử dụng prompt thiết kế riêng để tư vấn sản phẩm thể thao và kiểm tra thông tin đơn hàng theo định dạng tiền tệ VND.

### 4. 🎨 Giao Diện Responsive & Theme Đỏ Thể Thao
- Tông màu chủ đạo **Đỏ Thể thao (#DC2626)** mạnh mẽ và năng động.
- Giao diện tối ưu hóa 100% responsive cho mọi loại thiết bị (Mobile, Tablet, Desktop). Hiển thị mượt mà 2 cột sản phẩm trên dòng mobile hẹp, tự động thu gọn menu thành Hamburger Drawer, và hỗ trợ cuộn ngang tự động cho các bảng dữ liệu giỏ hàng/đơn hàng.

---

## 🔧 Hướng Dẫn Cài Đặt & Chạy Dự Án (Installation Guide)

### Bước 1: Clone dự án và cấu hình Cơ sở dữ liệu
Đảm bảo bạn đã cài đặt và khởi động **MongoDB** trên máy cục bộ (mặc định cổng `27017`).

### Bước 2: Cấu hình biến môi trường (`.env`)
Tệp tin `.env` được dùng để quản lý các cấu hình kết nối. Bạn có thể sử dụng kết nối MongoDB local hoặc MongoDB Atlas đám mây:

```env
# 📌 BẮT BUỘC: Đường dẫn kết nối MongoDB (Local hoặc MongoDB Atlas cloud)
MONGO_URI=mongodb://localhost:27017/andrewsport

# ⚙️ TÙY CHỌN: Cấu hình SMTP Gmail (Nếu muốn gửi mail thật, nếu bỏ trống sẽ tự động in OTP ra console của Spring Boot)
SMTP_USERNAME=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# ⚙️ TÙY CHỌN: OpenAI API Key (Chỉ cần nếu muốn dùng API OpenAI thật cho Chatbot, nếu bỏ trống sẽ dùng mô phỏng Tiếng Việt)
OPENAI_API_KEY=your_openai_api_key_here
```

> [!NOTE]
> Mật khẩu ứng dụng Gmail (App Password) có thể được tạo trong cài đặt bảo mật tài khoản Google của bạn (nếu đã kích hoạt xác minh 2 bước).

### Bước 3: Khởi chạy Backend (Spring Boot)
1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Nếu IDE của bạn chưa tự động nhận diện dependency mới, hãy chạy lệnh sau để tải và đồng bộ:
   ```bash
   mvn clean install
   ```
3. Khởi chạy ứng dụng:
   ```bash
   mvn spring-boot:run
   ```
   *Lớp cơ sở dữ liệu mẫu về vợt, giày, bóng tennis, pickleball sẽ tự động được khởi tạo vào MongoDB ở lần chạy đầu tiên.*

### Bước 4: Khởi chạy Frontend (React + Vite)
1. Di chuyển vào thư mục frontend:
   ```bash
   cd ../frontend
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy dự án ở chế độ lập trình viên:
   ```bash
   npm run dev
   ```
   *Truy cập ứng dụng tại địa chỉ mặc định: http://localhost:5173*

---

## 📑 Danh Sách API Đăng Ký & Xác Thực (Authentication APIs)

Tất cả các API đăng ký/xác thực đều được cấu hình cho phép truy cập tự do không cần Token:

| HTTP Method | Endpoint | Mô tả | Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register/send-otp` | Kiểm tra tài khoản hợp lệ & gửi OTP đăng ký | `{ "email": "test@gmail.com", "username": "user123" }` |
| **POST** | `/api/auth/register/verify-otp` | Xác thực OTP & Hoàn tất tạo tài khoản | `{ "username": "user123", "password": "...", "email": "...", "fullName": "...", "otp": "123456" }` |
| **POST** | `/api/auth/forgot-password/send-otp` | Gửi mã OTP khôi phục mật khẩu | `{ "email": "test@gmail.com", "type": "FORGOT_PASSWORD" }` |
| **POST** | `/api/auth/forgot-password/reset` | Xác thực OTP & Thiết lập mật khẩu mới | `{ "email": "...", "otp": "123456", "newPassword": "..." }` |
| **POST** | `/api/auth/social-login` | Đăng nhập/Đăng ký nhanh qua Google/Facebook | `{ "provider": "GOOGLE", "email": "...", "fullName": "...", "providerId": "..." }` |
| **POST** | `/api/auth/login` | Đăng nhập tài khoản mật khẩu thông thường | `{ "username": "...", "password": "..." }` |
| **POST** | `/api/auth/refresh` | Làm mới access token bằng refresh token | `{ "refreshToken": "..." }` |

---

## 🛠️ Hướng Dẫn Kiểm Thử Nhanh (Developer Quick Test)

1. **Test Đăng Ký Tài Khoản**:
   - Vào trang **Đăng ký**, nhập các thông tin mong muốn.
   - Nhập một email bất kỳ (Ví dụ: `test@gmail.com`). Click "Gửi mã xác minh OTP qua Gmail".
   - Mở cửa sổ console log của Backend Spring Boot lên, bạn sẽ thấy dòng chữ:
     ```text
     =========================================
     OTP CODE FOR test@gmail.com (Đăng ký tài khoản): 123456
     =========================================
     ```
   - Điền mã số `123456` vào ô xác thực trên giao diện và bấm "Xác thực và Đăng ký" để tạo tài khoản thành công!

2. **Test Đặt Lại Mật Khẩu**:
   - Ở màn hình **Đăng nhập**, click "Quên mật khẩu?".
   - Nhập email của tài khoản vừa tạo và click gửi mã.
   - Lấy mã OTP trong console log Backend, nhập mã và mật khẩu mới để đặt lại mật khẩu của bạn.

3. **Test Đăng Nhập Social**:
   - Click nút **Google** hoặc **Facebook**.
   - Khi Modal giả lập hiện lên, click chọn tài khoản test `Nguyễn Văn A` hoặc điền email tùy chỉnh.
   - Bấm đăng nhập để tự động liên kết hoặc tạo tài khoản và chuyển về trang chủ ngay lập tức.
