package com.andrewsport.ecommerce.model;

public class ProductVariation {
    private String sku;
    private Double price;
    private Integer stockQuantity;
    private String imageUrl;
    private String color;
    private String size;
    private String weightGrip;
    private String genderForm;
    private String type;

    public ProductVariation() {}

    public ProductVariation(String sku, Double price, Integer stockQuantity, String imageUrl, String color, String size, String weightGrip, String genderForm, String type) {
        this.sku = sku;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.imageUrl = imageUrl;
        this.color = color;
        this.size = size;
        this.weightGrip = weightGrip;
        this.genderForm = genderForm;
        this.type = type;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getWeightGrip() {
        return weightGrip;
    }

    public void setWeightGrip(String weightGrip) {
        this.weightGrip = weightGrip;
    }

    public String getGenderForm() {
        return genderForm;
    }

    public void setGenderForm(String genderForm) {
        this.genderForm = genderForm;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
