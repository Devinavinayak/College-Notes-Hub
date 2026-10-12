package com.college.notes.config;
import org.springframework.beans.factory.annotation.Value; import org.springframework.context.annotation.Configuration; import org.springframework.web.servlet.config.annotation.*; import java.nio.file.*;
@Configuration public class WebConfig implements WebMvcConfigurer { @Value("${app.upload-dir}") String uploadDir; public void addResourceHandlers(ResourceHandlerRegistry r){try{String p=Paths.get(uploadDir).toAbsolutePath().normalize().toUri().toString();r.addResourceHandler("/uploads/**").addResourceLocations(p);}catch(Exception ignored){}} }
