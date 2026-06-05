package com.andrewsport.ecommerce.loader;

import com.andrewsport.ecommerce.model.Category;
import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.model.User;
import com.andrewsport.ecommerce.repository.CategoryRepository;
import com.andrewsport.ecommerce.repository.ProductRepository;
import com.andrewsport.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        categoryRepository.deleteAll();
        productRepository.deleteAll();
        seedCategories();
        seedProducts();
        seedUsers();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            System.out.println("Seeding categories...");
            categoryRepository.saveAll(Arrays.asList(
                    new Category("Badminton", "Vợt cầu lông, quả cầu lông, giày và phụ kiện cầu lông", "badminton"),
                    new Category("Tennis", "Vợt tennis, bóng tennis, túi và giày tennis", "tennis"),
                    new Category("Pickleball", "Vợt pickleball, bóng và phụ kiện pickleball", "pickleball")
            ));
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            System.out.println("Seeding products...");
            productRepository.saveAll(Arrays.asList(
                    // Badminton Rackets - Full specs
                    createRacket("Vợt cầu lông Yonex Astrox 99 Pro", 
                            "Dòng vợt nặng đầu, thân cứng siêu cao cấp mang lại những pha đập cầu có uy lực bộc phá cực kỳ khủng khiếp.", 
                            4190000.0, 15, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Yonex", "675", "205", "above88", "3U", "Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đơn", "Khá Tốt", 
                            "2G-Namd Flex Force", "ROTATIONAL GENARATOR SYSTEM", "ISOMETRIC", "AERO+BOX FRAME"),
                    
                    createRacket("Vợt cầu lông Yonex Voltric Z Force II", 
                            "Khung vợt siêu mỏng khí động học, điểm cân bằng cực kỳ nặng đầu cho sức mạnh đập cầu tấn công tối thượng.", 
                            4300000.0, 8, "https://images.unsplash.com/photo-1521537634581-0dccd2ebe247?q=80&w=400", 
                            "Yonex", "675", "200", "above88", "3U", "Siêu Nặng Đầu", "Siêu Cứng", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                            "ISOMETRIC", "SOLID FEEL CORE", "AERO FRAME"),

                    createRacket("Vợt cầu lông Yonex Nanoflare 1000Z", 
                            "Dòng vợt chuyên tạt cầu nhanh, phản tạt linh hoạt, tốc độ vung vợt đứng đầu thế giới.", 
                            3950000.0, 12, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Yonex", "675", "210", "82-84", "4U", "Nhẹ Đầu", "Cứng", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Khá Tốt", 
                            "M40X", "SONIC FLARE SYSTEM", "ISOMETRIC", "AERO FRAME"),

                    createRacket("Vợt cầu lông Lining Tectonic 7", 
                            "Cấu trúc khung hộp đàn hồi cao tăng cường trợ lực và tốc độ ra vợt.", 
                            2800000.0, 10, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Lining", "675", "200", "84-86", "4U", "Hơi Nặng Đầu", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Khá Tốt", 
                            "ISOMETRIC", "BOX FRAME"),

                    createRacket("Vợt cầu lông Lining Axforce 80", 
                            "Thiết kế dành cho lối chơi tấn công uy lực, khả năng smash đầm tay.", 
                            3550000.0, 15, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Lining", "675", "205", "86-88", "3U", "Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đơn", "Khá Tốt", 
                            "BOX FRAME", "ISOMETRIC"),

                    createRacket("Vợt cầu lông Lining Windstorm 72", 
                            "Dòng vợt siêu nhẹ thuộc phân khúc Super Light hỗ trợ xoay trở nhanh, trợ lực tốt.", 
                            1650000.0, 20, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Lining", "675", "200", "under82", "F", "Nặng Đầu", "Dẻo", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Mới Chơi", 
                            "ISOMETRIC"),

                    createRacket("Vợt cầu lông Victor Thruster K Ryuga II", 
                            "Thế hệ vợt tấn công mạnh mẽ với thiết kế rồng quấn ma mị, trợ lực đập cầu tối đa.", 
                            3250000.0, 14, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Victor", "675", "205", "above88", "4U", "Nặng Đầu", "Cứng", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                            "ISOMETRIC", "AERO+BOX FRAME"),

                    createRacket("Vợt cầu lông Victor Auraspeed 90K II", 
                            "Dòng vợt tốc độ, kiểm soát thế trận cực kỳ tốt cho những pha cầu nhanh ở vị trí trước lưới.", 
                            3100000.0, 11, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Victor", "675", "210", "82-84", "4U", "Nhẹ Đầu", "Cứng", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Khá Tốt", 
                            "AERO+BOX FRAME", "ISOMETRIC"),

                    createRacket("Vợt cầu lông VS Kirin 80", 
                            "Vợt trung cấp thiết kế sắc sảo trợ lực tốt, công thủ toàn diện cực kỳ dễ chơi.", 
                            950000.0, 30, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "VS", "675", "205", "82-84", "4U", "Cân Bằng", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Trung Bình", 
                            "ISOMETRIC"),

                    createRacket("Vợt cầu lông VS Titan 7", 
                            "Vợt phân khúc giá rẻ cực kỳ dẻo dai thích hợp cho học sinh sinh viên và người mới tập.", 
                            480000.0, 25, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "VS", "670", "210", "under82", "5U", "Nhẹ Đầu", "Dẻo", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Mới Chơi", 
                            "ISOMETRIC"),

                    createRacket("Vợt cầu lông VS Carbon Training 120g", 
                            "Vợt tập lực cổ tay siêu nặng 2U (120g) dùng cho rèn luyện cơ tay và tăng sức mạnh đập cầu.", 
                            1200000.0, 10, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "VS", "675", "205", "above88", "2U", "Cân Bằng", "Trung Bình", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                            "ISOMETRIC"),

                    createRacket("Vợt cầu lông Mizuno Altrax 81", 
                            "Khung vợt xoắn độc đáo giúp giảm lực cản không khí tối ưu hóa cú vung.", 
                            1450000.0, 16, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Mizuno", "675", "205", "84-86", "4U", "Cân Bằng", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Trung Bình", 
                            "AERO FRAME", "ISOMETRIC"),

                    createRacket("Vợt cầu lông Apacs Vanguard 11", 
                            "Vợt cầu lông giá rẻ khung chịu lực căng cao vô cùng bền bỉ dẻo dai.", 
                            680000.0, 22, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                            "Apacs", "675", "210", "84-86", "4U", "Cân Bằng", "Dẻo", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Mới Chơi", 
                            "ISOMETRIC"),

                    // Other Badminton Products
                    new Product("Quả cầu lông Yonex Aerosensa 50 (Hộp 12 quả)", "Hộp 12 quả cầu lông lông vũ cao cấp chuyên dùng cho tập luyện chuyên nghiệp và thi đấu quốc gia.", 350000.0, 50, "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),
                    new Product("Giày cầu lông Yonex Comfort Z3", "Giày cầu lông cao cấp với đệm Power Cushion+ hấp thụ chấn động và hoàn trả năng lượng tối đa.", 2450000.0, 8, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),
                    new Product("Giày cầu lông Victor P9200", "Dòng giày bền bỉ, ôm chân thoải mái chuyên dùng cho thi đấu cầu lông đỉnh cao.", 1890000.0, 12, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400", "Badminton", "Victor", "ACTIVE"),
                    new Product("Áo cầu lông Yonex mẫu mới 2026", "Chất liệu thun lạnh co giãn 4 chiều, thấm hút mồ hôi cực tốt khi vận động cường độ cao.", 180000.0, 40, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),
                    new Product("Quần cầu lông Yonex chính hãng", "Kiểu dáng thể thao, thoáng mát, cạp chun co giãn dễ chịu phù hợp cả nam và nữ.", 150000.0, 35, "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),
                    new Product("Váy cầu lông Lining thời trang", "Thiết kế năng động cá tính tích hợp quần bảo hộ bên trong, tự tin hoạt động trên sân đấu.", 160000.0, 20, "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=400", "Badminton", "Lining", "ACTIVE"),
                    new Product("Balo cầu lông Yonex Pro", "Nhiều ngăn chứa rộng rãi, tích hợp ngăn đựng giày chuyên dụng riêng biệt vệ sinh.", 890000.0, 15, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),
                    new Product("Túi vợt cầu lông Lining", "Túi đựng vợt chất liệu chống nước cao cấp, bảo vệ khung vợt khỏi va đập nhiệt độ.", 750000.0, 15, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Badminton", "Lining", "ACTIVE"),
                    new Product("Cước đan vợt cầu lông Yonex BG 65", "Cước đan vợt quốc dân siêu bền bỉ, cảm giác đánh nảy tốt, tiếng nổ đanh.", 140000.0, 200, "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=400", "Badminton", "Yonex", "ACTIVE"),

                    // Tennis
                    new Product("Vợt Tennis Wilson Pro Staff 97 v14", "Dòng vợt cao cấp đồng thiết kế bởi Roger Federer, mang lại độ chính xác và ổn định tuyệt đối.", 4950000.0, 10, "https://images.unsplash.com/photo-1617083934377-622b7d510f2c?q=80&w=400", "Tennis", "Wilson", "ACTIVE"),
                    new Product("Vợt Tennis Babolat Pure Drive", "Vua của sức mạnh và độ xoáy đột phá. Lựa chọn hàng đầu của các tay vợt tấn công.", 3900000.0, 12, "https://images.unsplash.com/photo-1622279457486-62dcc4a4b1d6?q=80&w=400", "Tennis", "Babolat", "ACTIVE"),
                    new Product("Vợt Tennis Head Radical MP 2026", "Thiết kế trợ lực tốt kết hợp công nghệ Auxetic mang lại cảm giác bóng cực kỳ chân thực và êm ái.", 4250000.0, 8, "https://images.unsplash.com/photo-1617083934377-622b7d510f2c?q=80&w=400", "Tennis", "Head", "ACTIVE"),
                    new Product("Bóng Tennis Wilson US Open (Lon 3 bóng)", "Bóng thi đấu chính thức của giải US Open, độ nảy cực kỳ ổn định, lớp nỉ siêu bền.", 120000.0, 100, "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400", "Tennis", "Wilson", "ACTIVE"),
                    new Product("Giày Tennis Asics Gel Resolution 9", "Dòng giày tennis ổn định gót chân, hấp thụ lực chấn động hoàn hảo chuyên cho di động trượt sân.", 3190000.0, 15, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", "Tennis", "Asics", "ACTIVE"),
                    new Product("Balo Tennis Babolat Pure Aero", "Balo thể thao đa năng đựng được 2 cây vợt tennis cùng nhiều ngăn đựng phụ kiện tiện lợi.", 1850000.0, 10, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Tennis", "Babolat", "ACTIVE"),

                    // Pickleball
                    new Product("Vợt Pickleball Selkirk Vanguard 2.0 Control", "Vợt pickleball sợi carbon cao cấp thiết kế tối ưu cho kiểm soát bóng, tạo xoáy cực đỉnh.", 5200000.0, 14, "https://images.unsplash.com/photo-1626224583563-7186a8771b6f?q=80&w=400", "Pickleball", "Selkirk", "ACTIVE"),
                    new Product("Vợt Pickleball Joola Ben Johns Hyperion CFS 16", "Vợt pickleball cao cấp của huyền thoại Ben Johns, bề mặt Carbon nhám xoáy đầm tay.", 6100000.0, 6, "https://images.unsplash.com/photo-1626224583563-7186a8771b6f?q=80&w=400", "Pickleball", "Joola", "ACTIVE"),
                    new Product("Vợt Pickleball Franklin Signature 16mm", "Lõi tổ ong Polypropylene kết hợp bề mặt carbon nhám mang lại sức mạnh đập bóng bộc phá.", 3200000.0, 11, "https://images.unsplash.com/photo-1611251189753-e61ef333f9e1?q=80&w=400", "Pickleball", "Franklin", "ACTIVE"),
                    new Product("Bóng Pickleball Franklin X-40 (Hộp 3 quả)", "Bóng thi đấu ngoài trời tiêu chuẩn quốc tế với 40 lỗ khoan máy, bay chuẩn, cực bền.", 180000.0, 120, "https://images.unsplash.com/photo-1609141019688-66df3791a82f?q=80&w=400", "Pickleball", "Franklin", "ACTIVE"),
                    new Product("Túi đựng vợt Pickleball Joola", "Thiết kế năng động đựng được 4 vợt pickleball, bóng và các phụ kiện cá nhân đi kèm.", 950000.0, 18, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Pickleball", "Joola", "ACTIVE"),
                    new Product("Giày Pickleball Babolat Jet Tere", "Đế giày Michelin bám sân cực tốt, chất liệu siêu nhẹ và thoáng khí tối đa.", 2450000.0, 12, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400", "Pickleball", "Babolat", "ACTIVE")
            ));
        }
    }

    private Product createRacket(String name, String desc, Double price, Integer stock, String imgUrl, String brand,
                                 String length, String grip, String swing, String weight, String balance,
                                 String stiffness, String playStyle, String gameMode, String level, String... techs) {
        Product p = new Product(name, desc, price, stock, imgUrl, "Badminton", brand, "ACTIVE");
        p.setLength(length);
        p.setGripLength(grip);
        p.setSwingweight(swing);
        p.setWeight(weight);
        p.setBalance(balance);
        p.setStiffness(stiffness);
        p.setPlayStyle(playStyle);
        p.setGameMode(gameMode);
        p.setLevel(level);
        if (techs != null && techs.length > 0) {
            p.setTechnologies(Arrays.asList(techs));
        } else {
            p.setTechnologies(Arrays.asList());
        }
        return p;
    }


    private void seedUsers() {
        if (userRepository.count() == 0) {
            System.out.println("Seeding users...");
            
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "admin@andrewsport.com",
                    "Andrew Qng (Admin)",
                    "ADMIN",
                    "ACTIVE"
            );
            userRepository.save(admin);

            User user = new User(
                    "user",
                    passwordEncoder.encode("user123"),
                    "user@example.com",
                    "Nguyen Quyen (Customer)",
                    "USER",
                    "ACTIVE"
            );
            userRepository.save(user);
        }
    }
}
