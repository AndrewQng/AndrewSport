package com.andrewsport.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;

import org.springframework.lang.NonNull;

@Configuration
public class MongoConfig {

    @Bean
    public MongoTransactionManager transactionManager(@NonNull MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }
}
