package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Order;
import com.andrewsport.ecommerce.model.OrderItem;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendOtpEmail(String toEmail, String otpCode, String typeName) {
        System.out.println("=========================================");
        System.out.println("OTP CODE FOR " + toEmail + " (" + typeName + "): " + otpCode);
        System.out.println("=========================================");

        if (mailSender == null || mailUsername == null || mailUsername.trim().isEmpty() || mailUsername.equals("your_gmail@gmail.com")) {
            System.out.println("SMTP Mail Sender is not configured. OTP printed above.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailUsername);
            helper.setTo(toEmail);
            helper.setSubject("[" + typeName + "] Mã xác minh OTP - AndrewSport");

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);\">" +
                    "  <div style=\"background: linear-gradient(135deg, #1f1f2e 0%, #11111a 100%); padding: 25px; text-align: center; border-bottom: 4px solid #E95211;\">" +
                    "    <h2 style=\"color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;\">Andrew<span style=\"color: #E95211;\">Sport</span></h2>" +
                    "  </div>" +
                    "  <div style=\"padding: 30px; background-color: #ffffff; color: #333333;\">" +
                    "    <p style=\"font-size: 16px; margin-top: 0;\">Chào bạn,</p>" +
                    "    <p style=\"font-size: 14px; line-height: 1.5; color: #666666;\">Bạn đã yêu cầu mã xác minh OTP cho chức năng <strong>" + typeName + "</strong>. Dưới đây là mã xác minh của bạn:</p>" +
                    "    <div style=\"text-align: center; margin: 30px 0;\">" +
                    "      <span style=\"font-size: 32px; font-weight: 700; color: #E95211; letter-spacing: 4px; border: 2px dashed #E95211; padding: 10px 25px; border-radius: 6px; background-color: #fffaf7;\">" + otpCode + "</span>" +
                    "    </div>" +
                    "    <p style=\"font-size: 13px; color: #999999; line-height: 1.4;\">* Mã xác minh này có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai để bảo mật tài khoản của bạn.</p>" +
                    "  </div>" +
                    "  <div style=\"background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #999999; border-top: 1px solid #e0e0e0;\">" +
                    "    © 2026 AndrewSport E-Commerce. All rights reserved." +
                    "  </div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("OTP Email successfully sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email to " + toEmail + ": " + e.getMessage());
        }
    }

    public void sendOrderInvoiceEmail(Order order, String toEmail) {
        System.out.println("=========================================");
        System.out.println("SENDING INVOICE EMAIL TO: " + toEmail + " FOR ORDER: " + order.getId());
        System.out.println("=========================================");

        if (mailSender == null || mailUsername == null || mailUsername.trim().isEmpty() || mailUsername.equals("your_gmail@gmail.com")) {
            System.out.println("SMTP Mail Sender is not configured. E-Invoice email skipped.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailUsername);
            helper.setTo(toEmail);
            helper.setSubject("[AndrewSport] Hóa đơn điện tử và Xác nhận mua hàng - Đơn hàng #" + order.getId());

            // Build product rows HTML
            StringBuilder itemRows = new StringBuilder();
            double subtotal = 0.0;
            for (OrderItem item : order.getItems()) {
                double itemTotal = item.getPrice() * item.getQuantity();
                subtotal += itemTotal;
                
                String variationStr = item.getVariationDetail() != null && !item.getVariationDetail().trim().isEmpty()
                        ? "<br><span style=\"font-size: 12px; color: #888888;\">Biến thể: " + item.getVariationDetail() + "</span>"
                        : "";
                String skuStr = item.getSku() != null && !item.getSku().trim().isEmpty()
                        ? "<br><span style=\"font-size: 11px; color: #aaaaaa; font-family: monospace;\">SKU: " + item.getSku() + "</span>"
                        : "";

                itemRows.append("<tr style=\"border-bottom: 1px solid #eeeeee;\">")
                        .append("  <td style=\"padding: 12px 0; color: #333333; line-height: 1.4;\">")
                        .append("    <strong>").append(item.getProductName()).append("</strong>")
                        .append(variationStr)
                        .append(skuStr)
                        .append("  </td>")
                        .append("  <td style=\"padding: 12px 0; text-align: center; color: #555555;\">").append(item.getQuantity()).append("</td>")
                        .append("  <td style=\"padding: 12px 0; text-align: right; color: #555555;\">").append(String.format("%,.0f", item.getPrice())).append(" đ</td>")
                        .append("  <td style=\"padding: 12px 0; text-align: right; color: #111111; font-weight: 600;\">").append(String.format("%,.0f", itemTotal)).append(" đ</td>")
                        .append("</tr>");
            }

            // Build discount row HTML if coupon applied
            String discountRow = "";
            if (order.getDiscountAmount() != null && order.getDiscountAmount() > 0) {
                discountRow = "<tr>" +
                        "  <td style=\"padding: 5px 0; width: 70%;\">Giảm giá (" + order.getCouponCode() + "):</td>" +
                        "  <td style=\"padding: 5px 0; color: #d9534f; font-weight: 600; width: 30%;\">-" + String.format("%,.0f", order.getDiscountAmount()) + " đ</td>" +
                        "</tr>";
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            String formattedDate = order.getOrderDate() != null ? order.getOrderDate().format(formatter) : "Vừa xong";

            String htmlContent = "<div style=\"font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);\">" +
                    "  <div style=\"background: linear-gradient(135deg, #1f1f2e 0%, #11111a 100%); padding: 30px; text-align: center; border-bottom: 5px solid #E95211;\">" +
                    "    <h1 style=\"color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;\">Andrew<span style=\"color: #E95211;\">Sport</span></h1>" +
                    "    <p style=\"color: #a0a0b0; margin: 5px 0 0 0; font-size: 14px;\">Hóa Đơn Điện Tử & Xác Nhận Đơn Hàng</p>" +
                    "  </div>" +
                    "  <div style=\"padding: 30px; background-color: #ffffff;\">" +
                    "    <p style=\"font-size: 16px; color: #333333; margin-top: 0;\">Chào <strong>" + order.getCustomerName() + "</strong>,</p>" +
                    "    <p style=\"font-size: 14px; color: #666666; line-height: 1.5;\">Cảm ơn bạn đã mua sắm tại <strong>AndrewSport</strong>. Đơn hàng của bạn đã được thanh toán thành công. Dưới đây là thông tin chi tiết hóa đơn điện tử của bạn:</p>" +
                    "    " +
                    "    <!-- Order Info -->" +
                    "    <div style=\"background-color: #f8f9fa; border-left: 4px solid #E95211; padding: 15px; margin: 20px 0; border-radius: 0 4px 4px 0;\">" +
                    "      <table style=\"width: 100%; font-size: 13px; color: #555555; border-collapse: collapse;\">" +
                    "        <tr>" +
                    "          <td style=\"padding: 4px 0; width: 40%;\"><strong>Mã hóa đơn (Order ID):</strong></td>" +
                    "          <td style=\"padding: 4px 0; color: #111111; font-family: monospace; font-size: 14px;\"><strong>" + order.getId() + "</strong></td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "          <td style=\"padding: 4px 0;\"><strong>Ngày thanh toán:</strong></td>" +
                    "          <td style=\"padding: 4px 0; color: #111111;\">" + formattedDate + "</td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "          <td style=\"padding: 4px 0;\"><strong>Phương thức thanh toán:</strong></td>" +
                    "          <td style=\"padding: 4px 0; color: #111111;\">" + order.getPaymentMethod() + "</td>" +
                    "        </tr>" +
                    "        <tr>" +
                    "          <td style=\"padding: 4px 0;\"><strong>Địa chỉ giao hàng:</strong></td>" +
                    "          <td style=\"padding: 4px 0; color: #111111;\">" + order.getShippingAddress() + "</td>" +
                    "        </tr>" +
                    "      </table>" +
                    "    </div>" +
                    "    <!-- Items Table -->" +
                    "    <h3 style=\"color: #1f1f2e; border-bottom: 2px solid #f0f0f2; padding-bottom: 8px; margin-top: 30px; font-size: 16px;\">Chi Tiết Sản Phẩm</h3>" +
                    "    <table style=\"width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;\">" +
                    "      <thead>" +
                    "        <tr style=\"border-bottom: 2px solid #e0e0e0; text-align: left; color: #777777;\">" +
                    "          <th style=\"padding: 10px 0; font-weight: 600;\">Sản phẩm</th>" +
                    "          <th style=\"padding: 10px 0; font-weight: 600; text-align: center;\">SL</th>" +
                    "          <th style=\"padding: 10px 0; font-weight: 600; text-align: right;\">Đơn giá</th>" +
                    "          <th style=\"padding: 10px 0; font-weight: 600; text-align: right;\">Thành tiền</th>" +
                    "        </tr>" +
                    "      </thead>" +
                    "      <tbody>" +
                    itemRows.toString() +
                    "      </tbody>" +
                    "    </table>" +
                    "    <!-- Totals -->" +
                    "    <div style=\"border-top: 2px solid #e0e0e0; padding-top: 15px; margin-top: 20px;\">" +
                    "      <table style=\"width: 100%; font-size: 14px; color: #555555; text-align: right;\">" +
                    "        <tr>" +
                    "          <td style=\"padding: 5px 0; width: 70%;\">Tạm tính:</td>" +
                    "          <td style=\"padding: 5px 0; color: #111111; font-weight: 600; width: 30%;\">" + String.format("%,.0f", subtotal) + " đ</td>" +
                    "        </tr>" +
                    discountRow +
                    "        <tr style=\"font-size: 16px; color: #E95211;\">" +
                    "          <td style=\"padding: 10px 0; font-weight: 700;\">Tổng thanh toán:</td>" +
                    "          <td style=\"padding: 10px 0; font-weight: 700; font-size: 18px;\">" + String.format("%,.0f", order.getTotalAmount()) + " đ</td>" +
                    "        </tr>" +
                    "      </table>" +
                    "    </div>" +
                    "    <!-- Warranty Notice -->" +
                    "    <div style=\"margin-top: 35px; padding: 15px; background-color: #fff9f5; border: 1px dashed #ffd8c2; border-radius: 6px; font-size: 13px; color: #7a5036; line-height: 1.5;\">" +
                    "      <strong>Lưu ý về Bảo hành & Hoàn tiền:</strong><br>" +
                    "      - Đơn hàng được hỗ trợ hoàn tiền trong vòng <strong>7 ngày</strong> kể từ khi giao hàng thành công (yêu cầu sản phẩm còn nguyên vẹn, chụp ảnh minh chứng).<br>" +
                    "      - Sau khi giao hàng thành công, hệ thống sẽ tự động cấp <strong>Mã bảo hành</strong> riêng cho từng sản phẩm. Bạn có thể tra cứu mã bảo hành và gửi yêu cầu hoàn tiền/bảo hành trong phần <strong>Lịch sử đơn hàng</strong> trên website của chúng tôi." +
                    "    </div>" +
                    "  </div>" +
                    "  <!-- Footer -->" +
                    "  <div style=\"background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0;\">" +
                    "    Cảm ơn bạn đã tin dùng sản phẩm của AndrewSport!<br>" +
                    "    Mọi thắc mắc xin liên hệ với chúng tôi để được giải đáp.<br>" +
                    "    <p style=\"margin: 10px 0 0 0; font-weight: 600; color: #777777;\">© 2026 AndrewSport E-Commerce. All rights reserved.</p>" +
                    "  </div>" +
                    "</div>";

            helper.setText(htmlContent, true);
            mailSender.send(message);
            System.out.println("E-Invoice Email successfully sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send E-Invoice email to " + toEmail + ": " + e.getMessage());
        }
    }
}
