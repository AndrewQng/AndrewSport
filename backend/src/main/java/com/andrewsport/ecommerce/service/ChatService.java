package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.service.ai.AiClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ProductService productService;

    @Autowired
    private AiClient aiClient;

    public String getReply(String userMessage) {
        List<Product> products = productService.getAllProducts(null, null);
        
        StringBuilder catalogBuilder = new StringBuilder();
        catalogBuilder.append("AndrewSport Catalog:\n");
        if (products != null) {
            for (Product p : products) {
                catalogBuilder.append(String.format("- Name: %s, Category: %s, Brand: %s, Price: %.0f VND, Stock: %d, Description: %s",
                        p.getName(), p.getCategory(), p.getBrand(), p.getPrice(), p.getStockQuantity(), p.getDescription()));
                
                if (p.getVariations() != null && !p.getVariations().isEmpty()) {
                    catalogBuilder.append(", Variations (Biến thể): [");
                    for (int i = 0; i < p.getVariations().size(); i++) {
                        com.andrewsport.ecommerce.model.ProductVariation v = p.getVariations().get(i);
                        catalogBuilder.append(String.format("{SKU: %s, Price: %.0f VND, Stock: %d", v.getSku(), v.getPrice(), v.getStockQuantity()));
                        if (v.getColor() != null) catalogBuilder.append(", Color: ").append(v.getColor());
                        if (v.getSize() != null) catalogBuilder.append(", Size: ").append(v.getSize());
                        if (v.getWeightGrip() != null) catalogBuilder.append(", WeightGrip: ").append(v.getWeightGrip());
                        if (v.getGenderForm() != null) catalogBuilder.append(", Form: ").append(v.getGenderForm());
                        if (v.getType() != null) catalogBuilder.append(", Type: ").append(v.getType());
                        catalogBuilder.append("}");
                        if (i < p.getVariations().size() - 1) {
                            catalogBuilder.append(", ");
                        }
                    }
                    catalogBuilder.append("]");
                }
                catalogBuilder.append("\n");
            }
        }
        String catalog = catalogBuilder.toString();
        
        String systemPrompt = "You are a helpful sports gear shopping assistant for AndrewSport. " +
                "Use the following catalog to recommend products, guide customers, and talk like a friendly expert. " +
                "Please always reply in Vietnamese (Tiếng Việt) in a polite, helpful, and natural tone.\n" + catalog;

        try {
            return aiClient.generateReply(systemPrompt, userMessage);
        } catch (Exception e) {
            // Ultimate fallback safety net
            return "🤖 Tôi là Trợ lý ảo AndrewSport! Hiện tại kết nối AI đang gián đoạn, bạn vui lòng quay lại sau hoặc tham khảo trực tiếp các mẫu vợt Cầu lông/Tennis/Pickleball trên trang cửa hàng nhé!";
        }
    }
}
