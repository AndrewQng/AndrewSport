package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatService {

    @Value("${app.openai.api-key}")
    private String apiKey;

    @Autowired
    private ProductService productService;

    public String getReply(String userMessage) {
        List<Product> products = productService.getAllProducts(null, null);
        
        StringBuilder catalogBuilder = new StringBuilder();
        catalogBuilder.append("AndrewSport Catalog:\n");
        for (Product p : products) {
            catalogBuilder.append(String.format("- Name: %s, Category: %s, Brand: %s, Price: %.0f VND, Stock: %d, Description: %s\n",
                    p.getName(), p.getCategory(), p.getBrand(), p.getPrice(), p.getStockQuantity(), p.getDescription()));
        }
        String catalog = catalogBuilder.toString();

        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("mock-key") || apiKey.contains("OPENAI_API_KEY")) {
            return getLocalResponse(userMessage, products);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");

            List<Map<String, String>> messages = new ArrayList<>();
            
            Map<String, String> systemMsg = new HashMap<>();
            systemMsg.put("role", "system");
            systemMsg.put("content", "You are a helpful sports gear shopping assistant for AndrewSport. " +
                    "Use the following catalog to recommend products, guide customers, and talk like a friendly expert. " +
                    "Please always reply in Vietnamese (Tiếng Việt) in a polite, helpful, and natural tone.\n" + catalog);
            messages.add(systemMsg);

            Map<String, String> userMsg = new HashMap<>();
            userMsg.put("role", "user");
            userMsg.put("content", userMessage);
            messages.add(userMsg);

            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map choice = (Map) choices.get(0);
                    Map msgObj = (Map) choice.get("message");
                    if (msgObj != null) {
                        return (String) msgObj.get("content");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("OpenAI API call failed, falling back to local rule-based chatbot: " + e.getMessage());
        }

        return getLocalResponse(userMessage, products);
    }

    private String getLocalResponse(String message, List<Product> products) {
        String msgLower = message.toLowerCase();
        
        if (msgLower.contains("badminton") || msgLower.contains("cầu lông") || msgLower.contains("vợt cầu lông") || msgLower.contains("racket")) {
            return "🏸 Về môn Cầu lông, tôi đặc biệt khuyên bạn nên dùng dòng vợt **Yonex Astrox 99 Pro** hoặc **Yonex Voltric Z Force II** cho các cú đập cầu uy lực! Chúng tôi cũng có sẵn quả cầu lông Yonex Aerosensa và giày Yonex Power Cushion. Hãy cho tôi biết nếu bạn muốn biết thêm chi tiết nhé!";
        }
        
        if (msgLower.contains("tennis") || msgLower.contains("vợt tennis")) {
            return "🎾 Về môn Tennis, vợt **Wilson Pro Staff 97** là lựa chọn tuyệt vời cho sự chính xác và kiểm soát bóng, trong khi dòng **Babolat Pure Drive** mang lại lực đánh và độ xoáy cực tốt. Cửa hàng cũng có sẵn bóng tennis Wilson Championship. Bạn đang tìm kiếm thông số hay kích thước nào?";
        }

        if (msgLower.contains("pickleball") || msgLower.contains("chèo") || msgLower.contains("paddles")) {
            return "🏓 Pickleball đang phát triển rất nhanh! Vợt **Selkirk Vanguard 2.0** mang lại khả năng kiểm soát bóng và tạo xoáy vượt trội, còn dòng **Joola Ben Johns Hyperion** thì hoàn hảo cho các cú đánh tấn công mạnh mẽ. Chúng tôi có đầy đủ bóng và phụ kiện. Bạn là người mới chơi hay đã có kinh nghiệm?";
        }

        if (msgLower.contains("hello") || msgLower.contains("hi") || msgLower.contains("chào")) {
            return "👋 Xin chào! Chào mừng bạn đến với **Hỗ trợ khách hàng AndrewSport**. Tôi có thể giúp bạn chọn vợt Cầu lông, vợt Tennis, vợt Pickleball hoặc tư vấn thông tin sản phẩm trong cửa hàng. Bạn đang quan tâm đến môn thể thao nào thế?";
        }

        if (msgLower.contains("price") || msgLower.contains("giá") || msgLower.contains("bao nhiêu")) {
            for (Product p : products) {
                if (msgLower.contains(p.getName().toLowerCase())) {
                    String formattedPrice = String.format("%,.0f đ", p.getPrice());
                    return String.format("Giá của sản phẩm **%s** (%s) là **%s**. Hiện tại chúng tôi còn %d sản phẩm trong kho!", 
                            p.getName(), p.getCategory(), formattedPrice, p.getStockQuantity());
                }
            }
            return "Tất cả giá sản phẩm đều được hiển thị trực tiếp trên thẻ sản phẩm. Các dòng vợt cầu lông và tennis tiêu chuẩn có giá dao động từ 1.500.000 đ đến 6.000.000 đ. Bạn có đang quan tâm đến mẫu cụ thể nào không?";
        }

        if (msgLower.contains("ship") || msgLower.contains("giao hàng") || msgLower.contains("vận chuyển")) {
            return "🚚 Chúng tôi miễn phí vận chuyển cho tất cả đơn hàng từ 1.000.000 đ trở lên! Thời gian giao hàng tiêu chuẩn mất từ 2-4 ngày làm việc. Bạn có thể theo dõi trạng thái đơn hàng trong phần Lịch sử mua hàng của tài khoản.";
        }

        return "🤖 Tôi là Trợ lý ảo AndrewSport! Hãy hỏi tôi về các sản phẩm **Cầu lông**, **Tennis**, hoặc **Pickleball**, giá cả, số lượng tồn kho hoặc chính sách giao hàng. Tôi rất sẵn lòng hỗ trợ bạn!";
    }
}
