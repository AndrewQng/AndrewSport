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
            
            // Badminton Rackets
            Product astrox99 = createRacket("Vợt cầu lông Yonex Astrox 99 Pro", 
                    "Dòng vợt nặng đầu, thân cứng siêu cao cấp mang lại những pha đập cầu có uy lực bộc phá cực kỳ khủng khiếp.", 
                    4190000.0, 15, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Yonex", "675", "205", "above88", "3U", "Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đơn", "Khá Tốt", 
                    "2G-Namd Flex Force", "ROTATIONAL GENARATOR SYSTEM", "ISOMETRIC", "AERO+BOX FRAME");
            astrox99.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-AX99P-3UG5-CS", 4190000.0, 5, null, "Cherry Sunburst", null, "3U-G5", null, null),
                    new ProductVariation("YONEX-AX99P-4UG5-CS", 4190000.0, 10, null, "Cherry Sunburst", null, "4U-G5", null, null)
            ));

            Product zforce = createRacket("Vợt cầu lông Yonex Voltric Z Force II", 
                    "Khung vợt siêu mỏng khí động học, điểm cân bằng cực kỳ nặng đầu cho sức mạnh đập cầu tấn công tối thượng.", 
                    4300000.0, 8, "https://images.unsplash.com/photo-1521537634581-0dccd2ebe247?q=80&w=400", 
                    "Yonex", "675", "200", "above88", "3U", "Siêu Nặng Đầu", "Siêu Cứng", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                    "ISOMETRIC", "SOLID FEEL CORE", "AERO FRAME");
            zforce.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-VZF2-3UG5-BK", 4300000.0, 3, null, "Đen", null, "3U-G5", null, null),
                    new ProductVariation("YONEX-VZF2-4UG5-BK", 4300000.0, 5, null, "Đen", null, "4U-G5", null, null)
            ));

            Product nanoflare = createRacket("Vợt cầu lông Yonex Nanoflare 1000Z", 
                    "Dòng vợt chuyên tạt cầu nhanh, phản tạt linh hoạt, tốc độ vung vợt đứng đầu thế giới.", 
                    3950000.0, 12, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Yonex", "675", "210", "82-84", "4U", "Nhẹ Đầu", "Cứng", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Khá Tốt", 
                    "M40X", "SONIC FLARE SYSTEM", "ISOMETRIC", "AERO FRAME");
            nanoflare.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-NF1000Z-4UG5-YL", 3950000.0, 6, null, "Vàng Sét", null, "4U-G5", null, null),
                    new ProductVariation("YONEX-NF1000Z-4UG6-YL", 3950000.0, 6, null, "Vàng Sét", null, "4U-G6", null, null)
            ));

            Product tectonic = createRacket("Vợt cầu lông Lining Tectonic 7", 
                    "Cấu trúc khung hộp đàn hồi cao tăng cường trợ lực và tốc độ ra vợt.", 
                    2800000.0, 10, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Lining", "675", "200", "84-86", "4U", "Hơi Nặng Đầu", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Khá Tốt", 
                    "ISOMETRIC", "BOX FRAME");
            tectonic.setVariations(Arrays.asList(
                    new ProductVariation("LINING-TEC7-4UG5-WH", 2800000.0, 5, null, "Trắng", null, "4U-G5", null, null),
                    new ProductVariation("LINING-TEC7-4UG5-BK", 2800000.0, 5, null, "Đen", null, "4U-G5", null, null)
            ));

            Product axforce80 = createRacket("Vợt cầu lông Lining Axforce 80", 
                    "Thiết kế dành cho lối chơi tấn công uy lực, khả năng smash đầm tay.", 
                    3550000.0, 15, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Lining", "675", "205", "86-88", "3U", "Nặng Đầu", "Cứng", "Tấn Công", "Đánh Đơn", "Khá Tốt", 
                    "BOX FRAME", "ISOMETRIC");
            axforce80.setVariations(Arrays.asList(
                    new ProductVariation("LINING-AX80-3UG5-BK", 3550000.0, 7, null, "Đen Cam", null, "3U-G5", null, null),
                    new ProductVariation("LINING-AX80-4UG5-BK", 3550000.0, 8, null, "Đen Cam", null, "4U-G5", null, null)
            ));

            Product windstorm = createRacket("Vợt cầu lông Lining Windstorm 72", 
                    "Dòng vợt siêu nhẹ thuộc phân khúc Super Light hỗ trợ xoay trở nhanh, trợ lực tốt.", 
                    1650000.0, 20, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Lining", "675", "200", "under82", "F", "Nặng Đầu", "Dẻo", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Mới Chơi", 
                    "ISOMETRIC");
            windstorm.setVariations(Arrays.asList(
                    new ProductVariation("LINING-WS72-FG5-PK", 1650000.0, 10, null, "Hồng", null, "5U-G5", null, null),
                    new ProductVariation("LINING-WS72-FG5-BL", 1650000.0, 10, null, "Xanh", null, "5U-G5", null, null)
            ));

            Product ryuga = createRacket("Vợt cầu lông Victor Thruster K Ryuga II", 
                    "Thế hệ vợt tấn công mạnh mẽ với thiết kế rồng quấn ma mị, trợ lực đập cầu tối đa.", 
                    3250000.0, 14, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Victor", "675", "205", "above88", "4U", "Nặng Đầu", "Cứng", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                    "ISOMETRIC", "AERO+BOX FRAME");
            ryuga.setVariations(Arrays.asList(
                    new ProductVariation("VICTOR-RYU2-3UG5-RD", 3250000.0, 6, null, "Đỏ Đen", null, "3U-G5", null, null),
                    new ProductVariation("VICTOR-RYU2-4UG5-RD", 3250000.0, 8, null, "Đỏ Đen", null, "4U-G5", null, null)
            ));

            Product auraspeed = createRacket("Vợt cầu lông Victor Auraspeed 90K II", 
                    "Dòng vợt tốc độ, kiểm soát thế trận cực kỳ tốt cho những pha cầu nhanh ở vị trí trước lưới.", 
                    3100000.0, 12, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Victor", "675", "210", "82-84", "4U", "Nhẹ Đầu", "Cứng", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Khá Tốt", 
                    "AERO+BOX FRAME", "ISOMETRIC");
            auraspeed.setVariations(Arrays.asList(
                    new ProductVariation("VICTOR-ARS90K-4UG5-WH", 3100000.0, 6, null, "Trắng Xanh", null, "4U-G5", null, null),
                    new ProductVariation("VICTOR-ARS90K-4UG5-BK", 3100000.0, 6, null, "Đen", null, "4U-G5", null, null)
            ));

            Product kirin = createRacket("Vợt cầu lông VS Kirin 80", 
                    "Vợt trung cấp thiết kế sắc sảo trợ lực tốt, công thủ toàn diện cực kỳ dễ chơi.", 
                    950000.0, 30, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "VS", "675", "205", "82-84", "4U", "Cân Bằng", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Trung Bình", 
                    "ISOMETRIC");
            kirin.setVariations(Arrays.asList(
                    new ProductVariation("VS-KIRIN80-4UG5-BL", 950000.0, 15, null, "Xanh", null, "4U-G5", null, null),
                    new ProductVariation("VS-KIRIN80-4UG5-RD", 950000.0, 15, null, "Đỏ", null, "4U-G5", null, null)
            ));

            Product titan = createRacket("Vợt cầu lông VS Titan 7", 
                    "Vợt phân khúc giá rẻ cực kỳ dẻo dai thích hợp cho học sinh sinh viên và người mới tập.", 
                    480000.0, 25, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "VS", "670", "210", "under82", "5U", "Nhẹ Đầu", "Dẻo", "Phản Tạt, Phòng Thủ", "Đánh Đôi", "Mới Chơi", 
                    "ISOMETRIC");
            titan.setVariations(Arrays.asList(
                    new ProductVariation("VS-TITAN7-5UG5-BL", 480000.0, 12, null, "Xanh", null, "5U-G5", null, null),
                    new ProductVariation("VS-TITAN7-5UG5-PK", 480000.0, 13, null, "Hồng", null, "5U-G5", null, null)
            ));

            Product training = createRacket("Vợt cầu lông VS Carbon Training 120g", 
                    "Vợt tập lực cổ tay siêu nặng 2U (120g) dùng cho rèn luyện cơ tay và tăng sức mạnh đập cầu.", 
                    1200000.0, 10, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "VS", "675", "205", "above88", "2U", "Cân Bằng", "Trung Bình", "Tấn Công", "Cả Đơn và Đôi", "Khá Tốt", 
                    "ISOMETRIC");
            training.setVariations(Arrays.asList(
                    new ProductVariation("VS-TRAIN-2UG5-BK", 1200000.0, 10, null, "Đen", null, "2U-G5", null, null)
            ));

            Product mizuno = createRacket("Vợt cầu lông Mizuno Altrax 81", 
                    "Khung vợt xoắn độc đáo giúp giảm lực cản không khí tối ưu hóa cú vung.", 
                    1450000.0, 16, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Mizuno", "675", "205", "84-86", "4U", "Cân Bằng", "Trung Bình", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Trung Bình", 
                    "AERO FRAME", "ISOMETRIC");
            mizuno.setVariations(Arrays.asList(
                    new ProductVariation("MIZUNO-ALT81-4UG5-BK", 1450000.0, 16, null, "Đen Xám", null, "4U-G5", null, null)
            ));

            Product apacs = createRacket("Vợt cầu lông Apacs Vanguard 11", 
                    "Vợt cầu lông giá rẻ khung chịu lực căng cao vô cùng bền bỉ dẻo dai.", 
                    680000.0, 22, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", 
                    "Apacs", "675", "210", "84-86", "4U", "Cân Bằng", "Dẻo", "Công Thủ Toàn Diện", "Cả Đơn và Đôi", "Mới Chơi", 
                    "ISOMETRIC");
            apacs.setVariations(Arrays.asList(
                    new ProductVariation("APACS-VAN11-4UG5-RD", 680000.0, 22, null, "Đỏ", null, "4U-G5", null, null)
            ));

            // Other Badminton Products
            Product shuttle = new Product("Quả cầu lông Yonex Aerosensa 50 (Hộp 12 quả)", "Hộp 12 quả cầu lông lông vũ cao cấp chuyên dùng cho tập luyện chuyên nghiệp và thi đấu quốc gia.", 350000.0, 50, "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=400", "Badminton", "Yonex", "ACTIVE");
            
            Product shoesComfort = new Product("Giày cầu lông Yonex Comfort Z3", "Giày cầu lông cao cấp với đệm Power Cushion+ hấp thụ chấn động và hoàn trả năng lượng tối đa.", 2450000.0, 16, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", "Badminton", "Yonex", "ACTIVE");
            shoesComfort.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-SH-CZ3-WH-40", 2450000.0, 4, null, "Trắng Xanh", "40", null, null, null),
                    new ProductVariation("YONEX-SH-CZ3-WH-41", 2450000.0, 4, null, "Trắng Xanh", "41", null, null, null),
                    new ProductVariation("YONEX-SH-CZ3-RD-41", 2550000.0, 4, null, "Đỏ Đen", "41", null, null, null),
                    new ProductVariation("YONEX-SH-CZ3-RD-42", 2550000.0, 4, null, "Đỏ Đen", "42", null, null, null)
            ));

            Product shoesVictor = new Product("Giày cầu lông Victor P9200", "Dòng giày bền bỉ, ôm chân thoải mái chuyên dùng cho thi đấu cầu lông đỉnh cao.", 1890000.0, 15, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400", "Badminton", "Victor", "ACTIVE");
            shoesVictor.setVariations(Arrays.asList(
                    new ProductVariation("VICTOR-SH-P9200-YL-41", 1890000.0, 5, null, "Vàng Chuối", "41", null, null, null),
                    new ProductVariation("VICTOR-SH-P9200-YL-42", 1890000.0, 5, null, "Vàng Chuối", "42", null, null, null),
                    new ProductVariation("VICTOR-SH-P9200-YL-43", 1890000.0, 5, null, "Vàng Chuối", "43", null, null, null)
            ));

            Product shirtYonex = new Product("Áo cầu lông Yonex mẫu mới 2026", "Chất liệu thun lạnh co giãn 4 chiều, thấm hút mồ hôi cực tốt khi vận động cường độ cao.", 180000.0, 16, "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400", "Badminton", "Yonex", "ACTIVE");
            shirtYonex.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-SR-M26-NY-M-M", 180000.0, 4, null, "Xanh Navy", "M", null, "Nam", null),
                    new ProductVariation("YONEX-SR-M26-NY-M-L", 180000.0, 4, null, "Xanh Navy", "L", null, "Nam", null),
                    new ProductVariation("YONEX-SR-M26-RD-F-S", 190000.0, 4, null, "Đỏ Mặt Trời", "S", null, "Nữ", null),
                    new ProductVariation("YONEX-SR-M26-RD-F-M", 190000.0, 4, null, "Đỏ Mặt Trời", "M", null, "Nữ", null)
            ));

            Product shortsYonex = new Product("Quần cầu lông Yonex chính hãng", "Kiểu dáng thể thao, thoáng mát, cạp chun co giãn dễ chịu phù hợp cả nam và nữ.", 150000.0, 12, "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400", "Badminton", "Yonex", "ACTIVE");
            shortsYonex.setVariations(Arrays.asList(
                    new ProductVariation("YONEX-ST-BK-M", 150000.0, 3, null, "Đen", "M", null, null, "Quần Short"),
                    new ProductVariation("YONEX-ST-BK-L", 150000.0, 3, null, "Đen", "L", null, null, "Quần Short"),
                    new ProductVariation("YONEX-ST-WT-M", 150000.0, 3, null, "Trắng", "M", null, null, "Quần Short"),
                    new ProductVariation("YONEX-ST-WT-L", 150000.0, 3, null, "Trắng", "L", null, null, "Quần Short")
            ));

            Product skirtLining = new Product("Váy cầu lông Lining thời trang", "Thiết kế năng động cá tính tích hợp quần bảo hộ bên trong, tự tin hoạt động trên sân đấu.", 160000.0, 12, "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=400", "Badminton", "Lining", "ACTIVE");
            skirtLining.setVariations(Arrays.asList(
                    new ProductVariation("LINING-SK-WT-S", 160000.0, 3, null, "Trắng", "S", null, null, "Váy Cầu Lông"),
                    new ProductVariation("LINING-SK-WT-M", 160000.0, 3, null, "Trắng", "M", null, null, "Váy Cầu Lông"),
                    new ProductVariation("LINING-SK-BK-S", 160000.0, 3, null, "Đen", "S", null, null, "Váy Cầu Lông"),
                    new ProductVariation("LINING-SK-BK-M", 160000.0, 3, null, "Đen", "M", null, null, "Váy Cầu Lông")
            ));

            Product bagYonex = new Product("Balo cầu lông Yonex Pro", "Nhiều ngăn chứa rộng rãi, tích hợp ngăn đựng giày chuyên dụng riêng biệt vệ sinh.", 890000.0, 15, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Badminton", "Yonex", "ACTIVE");
            Product bagLining = new Product("Túi vợt cầu lông Lining", "Túi đựng vợt chất liệu chống nước cao cấp, bảo vệ khung vợt khỏi va đập nhiệt độ.", 750000.0, 15, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Badminton", "Lining", "ACTIVE");
            Product stringYonex = new Product("Cước đan vợt cầu lông Yonex BG 65", "Cước đan vợt quốc dân siêu bền bỉ, cảm giác đánh nảy tốt, tiếng nổ đanh.", 140000.0, 200, "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=400", "Badminton", "Yonex", "ACTIVE");

            // Tennis
            Product tennisProstaff = new Product("Vợt Tennis Wilson Pro Staff 97 v14", "Dòng vợt cao cấp đồng thiết kế bởi Roger Federer, mang lại độ chính xác và ổn định tuyệt đối.", 4950000.0, 10, "https://images.unsplash.com/photo-1617083934377-622b7d510f2c?q=80&w=400", "Tennis", "Wilson", "ACTIVE");
            tennisProstaff.setVariations(Arrays.asList(
                    new ProductVariation("WILSON-PS97-RD", 4950000.0, 5, null, "Đỏ Đen", null, null, null, null),
                    new ProductVariation("WILSON-PS97-YL", 5050000.0, 5, null, "Vàng Đen", null, null, null, null)
            ));

            Product tennisBabolat = new Product("Vợt Tennis Babolat Pure Drive", "Vua của sức mạnh và độ xoáy đột phá. Lựa chọn hàng đầu của các tay vợt tấn công.", 3900000.0, 12, "https://images.unsplash.com/photo-1622279457486-62dcc4a4b1d6?q=80&w=400", "Tennis", "Babolat", "ACTIVE");
            Product tennisHead = new Product("Vợt Tennis Head Radical MP 2026", "Thiết kế trợ lực tốt kết hợp công nghệ Auxetic mang lại cảm giác bóng cực kỳ chân thực và êm ái.", 4250000.0, 8, "https://images.unsplash.com/photo-1617083934377-622b7d510f2c?q=80&w=400", "Tennis", "Head", "ACTIVE");
            Product tennisBall = new Product("Bóng Tennis Wilson US Open (Lon 3 bóng)", "Bóng thi đấu chính thức của giải US Open, độ nảy cực kỳ ổn định, lớp nỉ siêu bền.", 120000.0, 100, "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=400", "Tennis", "Wilson", "ACTIVE");
            Product tennisShoes = new Product("Giày Tennis Asics Gel Resolution 9", "Dòng giày tennis ổn định gót chân, hấp thụ lực chấn động hoàn hảo chuyên cho di động trượt sân.", 3190000.0, 15, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400", "Tennis", "Asics", "ACTIVE");
            Product tennisBag = new Product("Balo Tennis Babolat Pure Aero", "Balo thể thao đa năng đựng được 2 cây vợt tennis cùng nhiều ngăn đựng phụ kiện tiện lợi.", 1850000.0, 10, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Tennis", "Babolat", "ACTIVE");

            // Pickleball
            Product pbSelkirk = new Product("Vợt Pickleball Selkirk Vanguard 2.0 Control", "Vợt pickleball sợi carbon cao cấp thiết kế tối ưu cho kiểm soát bóng, tạo xoáy cực đỉnh.", 5200000.0, 14, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", "Pickleball", "Selkirk", "ACTIVE");
            pbSelkirk.setVariations(Arrays.asList(
                    new ProductVariation("SELKIRK-VG2-RD", 5200000.0, 7, null, "Đỏ", null, null, null, null),
                    new ProductVariation("SELKIRK-VG2-BL", 5200000.0, 7, null, "Xanh", null, null, null, null)
            ));

            Product pbJoola = new Product("Vợt Pickleball Joola Ben Johns Hyperion CFS 16", "Vợt pickleball cao cấp của huyền thoại Ben Johns, bề mặt Carbon nhám xoáy đầm tay.", 6100000.0, 6, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=400", "Pickleball", "Joola", "ACTIVE");
            Product pbFranklin = new Product("Vợt Pickleball Franklin Signature 16mm", "Lõi tổ ong Polypropylene kết hợp bề mặt carbon nhám mang lại sức mạnh đập bóng bộc phá.", 3200000.0, 11, "https://images.unsplash.com/photo-1611251189753-e61ef333f9e1?q=80&w=400", "Pickleball", "Franklin", "ACTIVE");
            Product pbBall = new Product("Bóng Pickleball Franklin X-40 (Hộp 3 quả)", "Bóng thi đấu ngoài trời tiêu chuẩn quốc tế với 40 lỗ khoan máy, bay chuẩn, cực bền.", 180000.0, 120, "https://images.unsplash.com/photo-1609141019688-66df3791a82f?q=80&w=400", "Pickleball", "Franklin", "ACTIVE");
            Product pbBag = new Product("Túi đựng vợt Pickleball Joola", "Thiết kế năng động đựng được 4 vợt pickleball, bóng và các phụ kiện cá nhân đi kèm.", 950000.0, 18, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400", "Pickleball", "Joola", "ACTIVE");
            Product pbShoes = new Product("Giày Pickleball Babolat Jet Tere", "Đế giày Michelin bám sân cực tốt, chất liệu siêu nhẹ và thoáng khí tối đa.", 2450000.0, 12, "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=400", "Pickleball", "Babolat", "ACTIVE");

            productRepository.saveAll(Arrays.asList(
                    astrox99, zforce, nanoflare, tectonic, axforce80, windstorm, ryuga, auraspeed, kirin, titan, training, mizuno, apacs,
                    shuttle, shoesComfort, shoesVictor, shirtYonex, shortsYonex, skirtLining, bagYonex, bagLining, stringYonex,
                    tennisProstaff, tennisBabolat, tennisHead, tennisBall, tennisShoes, tennisBag,
                    pbSelkirk, pbJoola, pbFranklin, pbBall, pbBag, pbShoes
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
