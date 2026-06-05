package com.andrewsport.ecommerce.service;

import com.andrewsport.ecommerce.model.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();
    Category createCategory(Category category);
}
