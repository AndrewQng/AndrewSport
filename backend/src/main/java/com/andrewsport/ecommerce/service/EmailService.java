package com.andrewsport.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import java.lang.reflect.Method;

@Service
public class EmailService {

    @Autowired
    private ApplicationContext context;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public void sendOtpEmail(String toEmail, String otpCode, String typeName) {
        System.out.println("=========================================");
        System.out.println("OTP CODE FOR " + toEmail + " (" + typeName + "): " + otpCode);
        System.out.println("=========================================");

        if (mailUsername == null || mailUsername.trim().isEmpty() || mailUsername.equals("your_gmail@gmail.com")) {
            System.out.println("SMTP Mail Sender is not configured. OTP printed above.");
            return;
        }

        try {
            // Load JavaMailSender and SimpleMailMessage dynamically to prevent ClassNotFoundException during class loading
            Class<?> mailSenderClass = Class.forName("org.springframework.mail.javamail.JavaMailSender");
            Class<?> simpleMailMessageClass = Class.forName("org.springframework.mail.SimpleMailMessage");

            Object mailSender = context.getBean(mailSenderClass);
            if (mailSender == null) {
                System.out.println("SMTP Mail Sender bean is not available in context. OTP printed above.");
                return;
            }

            Object message = simpleMailMessageClass.getDeclaredConstructor().newInstance();
            
            Method setFrom = simpleMailMessageClass.getMethod("setFrom", String.class);
            Method setTo = simpleMailMessageClass.getMethod("setTo", String.class);
            Method setSubject = simpleMailMessageClass.getMethod("setSubject", String.class);
            Method setText = simpleMailMessageClass.getMethod("setText", String.class);

            setFrom.invoke(message, mailUsername);
            setTo.invoke(message, toEmail);
            setSubject.invoke(message, "[" + typeName + "] Ma xac minh OTP - AndrewSport");
            setText.invoke(message, "Chào bạn,\n\nMã xác minh OTP của bạn là: " + otpCode + 
                "\n\nMã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.\n\nTrân trọng,\nAndrewSport Team.");

            Method send = mailSenderClass.getMethod("send", simpleMailMessageClass);
            send.invoke(mailSender, message);
            System.out.println("OTP Email successfully sent to: " + toEmail);
        } catch (ClassNotFoundException e) {
            System.out.println("Spring Mail dependency is not yet synchronized on the classpath. Falling back to Console OTP logging.");
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }
}
