package com.andrewsport.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(EcommerceApplication.class, args);
    }

    private static void loadDotEnv() {
        // Try loading from current dir (backend/) or parent dir (root)
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("../.env");
        }
        if (envFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        System.setProperty(key, value);
                        System.out.println("Loaded env variable: " + key);
                    }
                }
            } catch (IOException e) {
                System.err.println("Failed to read .env file: " + e.getMessage());
            }
        } else {
            System.out.println(".env file not found. Falling back to default system properties.");
        }
    }
}
