package com.andrewsport.ecommerce.model;

public class OrderItem {
    private String productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private String imageUrl;
    private String sku;
    private String variationDetail;

    public OrderItem() {}

    public OrderItem(String productId, String productName, Double price, Integer quantity, String imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public OrderItem(String productId, String productName, Double price, Integer quantity, String imageUrl, String sku, String variationDetail) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.sku = sku;
        this.variationDetail = variationDetail;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getVariationDetail() {
        return variationDetail;
    }

    public void setVariationDetail(String variationDetail) {
        this.variationDetail = variationDetail;
    }
}
