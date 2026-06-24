package com.andrewsport.ecommerce.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private Cloudinary cloudinary;

    @Value("${CLOUDINARY_CLOUD_NAME:}")
    private String cloudName;

    @Value("${CLOUDINARY_API_KEY:}")
    private String apiKey;

    @Value("${CLOUDINARY_API_SECRET:}")
    private String apiSecret;

    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret,
            "secure", true
        ));
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty!");
        }

        // Upload the file bytes directly to Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        // Retrieve public ID of the uploaded image
        String publicId = (String) uploadResult.get("public_id");

        // Generate and return optimized image URL (f_auto, q_auto)
        return cloudinary.url()
                .transformation(new Transformation<>()
                        .fetchFormat("auto") // Automatic format selection
                        .quality("auto")     // Automatic quality compression
                )
                .secure(true)
                .generate(publicId);
    }
}
