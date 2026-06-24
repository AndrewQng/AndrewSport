package com.andrewsport.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private String category;
    private String brand;
    private String status; // ACTIVE, INACTIVE, DELETED
    private Boolean isFlashSale;
    private Double flashSalePrice;
    private String length;
    private String gripLength;
    private String swingweight;
    private String weight;
    private String balance;
    private String stiffness;
    private String playStyle;
    private String gameMode;
    private String level;
    private java.util.List<String> technologies;
    private java.util.List<ProductVariation> variations;
    private Integer warrantyPeriod = 12;

    public Product() {}

    public Product(String name, String description, Double price, Integer stockQuantity, String imageUrl, String category, String brand, String status) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.category = category;
        this.brand = brand;
        this.status = status;
        this.variations = new java.util.ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length;
    }

    public String getGripLength() {
        return gripLength;
    }

    public void setGripLength(String gripLength) {
        this.gripLength = gripLength;
    }

    public String getSwingweight() {
        return swingweight;
    }

    public void setSwingweight(String swingweight) {
        this.swingweight = swingweight;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getBalance() {
        return balance;
    }

    public void setBalance(String balance) {
        this.balance = balance;
    }

    public String getStiffness() {
        return stiffness;
    }

    public void setStiffness(String stiffness) {
        this.stiffness = stiffness;
    }

    public String getPlayStyle() {
        return playStyle;
    }

    public void setPlayStyle(String playStyle) {
        this.playStyle = playStyle;
    }

    public String getGameMode() {
        return gameMode;
    }

    public void setGameMode(String gameMode) {
        this.gameMode = gameMode;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public java.util.List<String> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(java.util.List<String> technologies) {
        this.technologies = technologies;
    }

    public java.util.List<ProductVariation> getVariations() {
        return variations;
    }

    public void setVariations(java.util.List<ProductVariation> variations) {
        this.variations = variations;
    }

    public Boolean getIsFlashSale() {
        return isFlashSale != null && isFlashSale;
    }

    public void setIsFlashSale(Boolean isFlashSale) {
        this.isFlashSale = isFlashSale;
    }

    public Double getFlashSalePrice() {
        return flashSalePrice;
    }

    public void setFlashSalePrice(Double flashSalePrice) {
        this.flashSalePrice = flashSalePrice;
    }

    public Integer getWarrantyPeriod() {
        return warrantyPeriod != null ? warrantyPeriod : 12;
    }

    public void setWarrantyPeriod(Integer warrantyPeriod) {
        this.warrantyPeriod = warrantyPeriod;
    }
}

