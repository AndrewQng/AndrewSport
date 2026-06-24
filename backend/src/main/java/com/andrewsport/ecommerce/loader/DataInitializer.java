package com.andrewsport.ecommerce.loader;

import com.andrewsport.ecommerce.model.Category;
import com.andrewsport.ecommerce.model.Product;
import com.andrewsport.ecommerce.model.ProductVariation;
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
@SuppressWarnings("null")
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
            System.out.println("Seeding ShopVNB products...");

            // --- BADMINTON RACKETS (5 products) ---
            Product astrox88d = createRacket("Vợt cầu lông Yonex Astrox 88D Pro Gen 3", 
                    "Dòng vợt nặng đầu, thân cứng cao cấp nhất dành cho lối chơi tấn công uy lực từ phía sau.", 
                    4150000.0, 15, null, "Yonex", 
                    "675", "205", "above88", "3U", "Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đôi", "Khá Tốt", 
                    "2G-Namd Flex Force", "Rotational Generator System", "AERO+BOX FRAME");
            astrox88d.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-AX88DP3-3UG5", 4150000.0, 5, null, "Đen Cam", null, "3U-G5", null, null),
                    new ProductVariation("YONEX-AX88DP3-4UG5", 4150000.0, 10, null, "Đen Cam", null, "4U-G5", null, null)
            ));

            Product halbertec8000 = createRacket("Vợt cầu lông Lining Halbertec 8000", 
                    "Khung vợt công nghệ carbon cao cấp giúp kiểm soát đường cầu cực tốt, công thủ toàn diện.", 
                    3850000.0, 12, null, "Lining", 
                    "675", "200", "84-86", "4U", "Cân Bằng", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Khá Tốt", 
                    "Dynamic-Optimum Frame", "Stabilized Elastic Shaft");
            halbertec8000.setVariations(Arrays.asList(
                    new ProductVariation("LINING-HB8000-3UG5", 3850000.0, 6, null, "Hồng Xanh", null, "3U-G5", null, null),
                    new ProductVariation("LINING-HB8000-4UG5", 3850000.0, 6, null, "Hồng Xanh", null, "4U-G5", null, null)
            ));

            Product ryugaMetallic = createRacket("Vợt cầu lông Victor Thruster Ryuga Metallic", 
                    "Khung hợp kim kim loại thế hệ mới mang lại cú đập cầu đầm tay và âm thanh đập cực đanh.", 
                    3990000.0, 10, null, "Victor", 
                    "675", "205", "above88", "3U", "Siêu Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đơn", "Khá Tốt", 
                    "Metallic Carbon Fiber", "WES 2.0");
            ryugaMetallic.setVariations(Arrays.asList(
                    new ProductVariation("VICTOR-RYUGAM-3UG5", 3990000.0, 5, null, "Đỏ Đen Kim Loại", null, "3U-G5", null, null),
                    new ProductVariation("VICTOR-RYUGAM-4UG5", 3990000.0, 5, null, "Đỏ Đen Kim Loại", null, "4U-G5", null, null)
            ));

            Product youlong = createRacket("Vợt cầu lông VS YouLong Cổ Long", 
                    "Dòng vợt rồng xanh quốc dân phân khúc trung cấp, trợ lực tay tốt, thiết kế sơn rồng quấn tinh xảo.", 
                    1150000.0, 30, null, "VS", 
                    "675", "200", "82-84", "4U", "Hơi Nặng Đầu", "Trung Bình", "Tấn Công", "Cả Đơn và Đôi", "Trung Bình", 
                    "Kevlar Carbon Fiber");
            youlong.setVariations(Arrays.asList(
                    new ProductVariation("VS-YOULONG-4UG5", 1150000.0, 30, null, "Xanh Ngọc Rồng", null, "4U-G5", null, null)
            ));

            Product tantrum200 = createRacket("Vợt cầu lông Apacs Tantrum 200 III", 
                    "Vợt đầm tay, chịu sức căng khủng lên tới 35 LBS, siêu bền bỉ huyền thoại phân khúc giá rẻ.", 
                    1350000.0, 20, null, "Apacs", 
                    "675", "210", "86-88", "3U", "Cân Bằng", "Cứng", "Công Thủ Toàn Diện", "Đánh Đôi", "Trung Bình", 
                    "High Modulus Graphite");
            tantrum200.setVariations(Arrays.asList(
                    new ProductVariation("APACS-T200III-3UG5", 1350000.0, 20, null, "Xanh Đen", null, "3U-G5", null, null)
            ));

            // --- BADMINTON SHOES (2 products) ---
            Product shoes65z3 = new Product("Giày cầu lông Yonex Power Cushion 65Z3 Crome", 
                    "Thế hệ giày huyền thoại được các tay vợt thế giới tin dùng, đệm Power Cushion+ siêu êm ái.", 
                    2650000.0, 16, null, "Badminton", "Yonex", "ACTIVE");
            shoes65z3.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-SH65Z3-CR-40", 2650000.0, 4, null, "Trắng Bạc", "40", null, null, null),
                    new ProductVariation("YONEX-SH65Z3-CR-41", 2650000.0, 4, null, "Trắng Bạc", "41", null, null, null),
                    new ProductVariation("YONEX-SH65Z3-CR-42", 2650000.0, 4, null, "Trắng Bạc", "42", null, null, null),
                    new ProductVariation("YONEX-SH65Z3-CR-43", 2650000.0, 4, null, "Trắng Bạc", "43", null, null, null)
            ));

            Product shoesRanger8 = new Product("Giày cầu lông Lining Ranger VIII", 
                    "Thiết kế form giày ôm chân cực chắc chắn, chống lật cổ chân và bám sân xuất sắc.", 
                    1750000.0, 12, null, "Badminton", "Lining", "ACTIVE");
            shoesRanger8.setVariations(Arrays.asList(
                    new ProductVariation("LINING-RANGER8-WH-40", 1750000.0, 3, null, "Trắng Hồng", "40", null, null, null),
                    new ProductVariation("LINING-RANGER8-WH-41", 1750000.0, 3, null, "Trắng Hồng", "41", null, null, null),
                    new ProductVariation("LINING-RANGER8-WH-42", 1750000.0, 3, null, "Trắng Hồng", "42", null, null, null),
                    new ProductVariation("LINING-RANGER8-WH-43", 1750000.0, 3, null, "Trắng Hồng", "43", null, null, null)
            ));

            // --- SPORTS FASHION (3 products) ---
            Product shirtVnb = new Product("Áo thun thể thao cầu lông VNB chính hãng", 
                    "Chất vải thun lạnh, thoáng khí tối đa, thấm hút mồ hôi cực tốt thích hợp chơi thể thao.", 
                    150000.0, 50, null, "Badminton", "VNB", "ACTIVE");
            shirtVnb.setVariations(Arrays.asList(
                    new ProductVariation("VNB-SHIRT-BL-M", 150000.0, 15, null, "Xanh Dương", "M", null, "Nam", "Áo Thun"),
                    new ProductVariation("VNB-SHIRT-BL-L", 150000.0, 15, null, "Xanh Dương", "L", null, "Nam", "Áo Thun"),
                    new ProductVariation("VNB-SHIRT-OR-S", 150000.0, 10, null, "Cam Cháy", "S", null, "Nữ", "Áo Thun"),
                    new ProductVariation("VNB-SHIRT-OR-M", 150000.0, 10, null, "Cam Cháy", "M", null, "Nữ", "Áo Thun")
            ));

            Product shortsLining = new Product("Quần short thể thao Lining mẫu mới", 
                    "Chất liệu co giãn, cạp chun thoải mái, thiết kế thể thao hiện đại, có túi khóa tiện lợi.", 
                    190000.0, 40, null, "Badminton", "Lining", "ACTIVE");
            shortsLining.setVariations(Arrays.asList(
                    new ProductVariation("LINING-SHORT-BK-M", 190000.0, 10, null, "Đen", "M", null, null, "Quần Ngắn"),
                    new ProductVariation("LINING-SHORT-BK-L", 190000.0, 10, null, "Đen", "L", null, null, "Quần Ngắn"),
                    new ProductVariation("LINING-SHORT-WT-M", 190000.0, 10, null, "Trắng", "M", null, null, "Quần Ngắn"),
                    new ProductVariation("LINING-SHORT-WT-L", 190000.0, 10, null, "Trắng", "L", null, null, "Quần Ngắn")
            ));

            Product skirtYonex = new Product("Chân váy tennis cầu lông Yonex thời trang", 
                    "Thiết kế xếp ly sang trọng năng động, có quần bảo hộ co giãn 4 chiều bên trong.", 
                    180000.0, 30, null, "Badminton", "Yonex", "ACTIVE");
            skirtYonex.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-SKIRT-WT-S", 180000.0, 10, null, "Trắng", "S", null, null, "Chân Váy"),
                    new ProductVariation("YONEX-SKIRT-WT-M", 180000.0, 10, null, "Trắng", "M", null, null, "Chân Váy"),
                    new ProductVariation("YONEX-SKIRT-BK-S", 180000.0, 5, null, "Đen", "S", null, null, "Chân Váy"),
                    new ProductVariation("YONEX-SKIRT-BK-M", 180000.0, 5, null, "Đen", "M", null, null, "Chân Váy")
            ));

            // --- BACKPACKS & ACCESSORIES (5 products) ---
            Product bagAlx = new Product("Balo cầu lông VNB Alx cao cấp", 
                    "Balo form đứng cứng cáp chống nước tốt, có ngăn đựng giày chống mùi riêng biệt và ngăn đựng vợt êm ái.", 
                    450000.0, 20, null, "Badminton", "VNB", "ACTIVE");
            
            Product bagYonex2 = new Product("Bao vợt cầu lông Yonex 2 ngăn chuyên dụng", 
                    "Chất liệu chống thấm nước tối đa, hai ngăn chứa cực rộng đựng được 5-6 cây vợt cùng quần áo, phụ kiện.", 
                    620000.0, 15, null, "Badminton", "Yonex", "ACTIVE");

            Product stringBg65 = new Product("Cước đan vợt cầu lông Yonex BG 65 Ti", 
                    "Cước đan vợt phủ lớp Titanium tăng cường sức mạnh đập cầu, cực kỳ bền bỉ chuyên nghiệp.", 
                    150000.0, 150, null, "Badminton", "Yonex", "ACTIVE");

            Product gripVs = new Product("Quấn cán vợt VS siêu thấm mồ hôi (Vỉ 3 cái)", 
                    "Chất liệu cao su non bám tay tốt, thấm hút mồ hôi cực nhanh, bảo vệ cán gỗ tối đa.", 
                    45000.0, 200, null, "Badminton", "VS", "ACTIVE");

            Product shuttleVnb = new Product("Hộp quả cầu lông lông vũ VNB M30 (Hộp 12 quả)", 
                    "Quả cầu lông vũ VNB M30 bay chuẩn ổn định, độ bền cao, thích hợp chơi cả trong nhà và ngoài trời.", 
                    220000.0, 100, null, "Badminton", "VNB", "ACTIVE");

            // --- TENNIS (3 products) ---
            Product tennisBlade = new Product("Vợt Tennis Wilson Blade 98 V9 chính hãng", 
                    "Phiên bản V9 mới nhất mang lại cảm giác kiểm soát bóng tối ưu, màu xanh ngọc lục bảo sang trọng.", 
                    4750000.0, 10, null, "Tennis", "Wilson", "ACTIVE");
            tennisBlade.setVariations(Arrays.asList(
                    new ProductVariation("WILSON-BLADE-L2", 4750000.0, 5, null, "Xanh Ngọc", null, null, null, null),
                    new ProductVariation("WILSON-BLADE-L3", 4750000.0, 5, null, "Xanh Ngọc", null, null, null, null)
            ));

            Product tennisPureAero = new Product("Vợt Tennis Babolat Pure Aero 2026", 
                    "Dòng vợt hỗ trợ tạo xoáy (spin) mạnh mẽ đặc trưng của Rafael Nadal, trợ lực tốt cho các cú swing.", 
                    4300000.0, 8, null, "Tennis", "Babolat", "ACTIVE");

            Product tennisBallBabolat = new Product("Bóng Tennis Babolat Gold (Lon 4 quả)", 
                    "Bóng thi đấu có độ nảy cực kỳ chuẩn xác, lớp nỉ siêu bền chịu lực đập liên tục tốt.", 
                    140000.0, 120, null, "Tennis", "Babolat", "ACTIVE");

            // --- PICKLEBALL (2 products) ---
            Product pbPerseus = new Product("Vợt Pickleball Joola Ben Johns Perseus CFS 16", 
                    "Dòng vợt cao cấp bề mặt carbon nhám xoáy, tăng lực đập bóng bộc phá, kiểm soát trận đấu hoàn hảo.", 
                    5990000.0, 8, null, "Pickleball", "Joola", "ACTIVE");

            Product pbSelkirkHalo = new Product("Vợt Pickleball Selkirk Halo Control 16mm", 
                    "Thiết kế tối ưu cho lối đánh kiểm soát điều bóng, lõi tổ ong êm tay tạo xoáy cực đỉnh.", 
                    4200000.0, 10, null, "Pickleball", "Selkirk", "ACTIVE");

            productRepository.saveAll(Arrays.asList(
                    astrox88d, halbertec8000, ryugaMetallic, youlong, tantrum200,
                    shoes65z3, shoesRanger8, shirtVnb, shortsLining, skirtYonex,
                    bagAlx, bagYonex2, stringBg65, gripVs, shuttleVnb,
                    tennisBlade, tennisPureAero, tennisBallBabolat,
                    pbPerseus, pbSelkirkHalo
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
