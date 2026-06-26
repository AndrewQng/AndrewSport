# AndrewSport E-Commerce

A web-based e-commerce platform specializing in sports equipment for badminton, tennis, and pickleball, featuring automated order fulfillment, inventory management, and an AI sports consultant assistant.

## Language

**Product (Sản phẩm)**:
An item listed for sale in the catalog, categorized under a specific sport (badminton, tennis, or pickleball). It contains base inventory properties and physical attributes specific to sports gear, and may embed a list of variations.
_Avoid_: Item, gear, equipment

**ProductVariation (Biến thể sản phẩm)**:
A specific purchasable variation of a product defined by its distinct attributes (e.g. Size, Color, Grip Size) having its own price, SKU, stock quantity, and optional image.
_Avoid_: Option, variant

**Category (Danh mục)**:
A classification grouping products by sport. The core categories are Badminton (Cầu lông), Tennis, and Pickleball.
_Avoid_: Department, section

**Order (Đơn hàng)**:
A finalized purchase transaction containing client details, `shippingAddress`, payment metadata (`paymentMethod`, `paymentStatus` [PENDING, PAID, FAILED]), fulfillment progress (`orderStatus` [PROCESSING, SHIPPED, DELIVERED, CANCELLED]), discount information (`couponCode`, `discountAmount`), and a list of `OrderItem` objects representing purchased products.
_Avoid_: Purchase, transaction, bill

**OrderItem (Chi tiết đơn hàng)**:
A line item within an order capturing the snapshot of the product at the time of purchase (`productId`, `productName`, `quantity`, and unit `price`).
_Avoid_: Order detail, cart item

**User (Người dùng)**:
An authenticated account on the platform with personal information, credentials, and a defined security role.
_Avoid_: Member, client, profile

**Review (Đánh giá)**:
Customer-submitted feedback on a product, consisting of a numeric `rating` (from 1 to 5) and a text `comment`.
_Avoid_: Feedback, comment, testimonial

**OtpVerification (Xác thực OTP)**:
A security entity storing temporary OTP codes sent to users to verify signup or account operations.
_Avoid_: Two-factor token, authentication code

**Assistant (Trợ lý AI)**:
An AI-powered consultant component (ChatGPT Assistant) embedded in the user interface to recommend sports gear matching the user's level and playstyle. It operates with a dynamic OpenAI configuration or falls back to an offline list.
_Avoid_: Chatbot, support bot, support agent

**Coupon (Mã giảm giá)**:
A promotional code applied to an order during checkout to receive a discount. It follows predefined validation rules (e.g. fixed deduction or percentage up to a maximum amount).
_Avoid_: Voucher, promo code, discount, gift card

**Refund (Yêu cầu hoàn tiền)**:
A customer request to return a product and receive a refund. It must reference a valid `orderId` (acting as the invoice key), be submitted within 7 days of the order, and include a photo verifying the product is intact.
_Avoid_: Return, payback

**Warranty (Yêu cầu bảo hành)**:
A customer request for product warranty service. It must reference a valid `orderId` (acting as the invoice key), describe the product issue, include a photo of the product, and specify the system-provided `warrantyCode`.
_Avoid_: Repair, guarantee

**SupportChat (Chat hỗ trợ trực tiếp)**:
A live text messaging channel between an authenticated User and Admin. There is exactly one thread per User, keyed by `userId`. Messages are persisted in the `chat_messages` MongoDB collection and delivered in realtime via WebSocket (STOMP over SockJS). Each message records `senderRole` (USER or ADMIN) and an `isRead` flag used to display unread badge counts.
_Avoid_: Ticket, live chat, support ticket
