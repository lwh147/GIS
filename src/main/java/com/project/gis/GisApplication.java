package com.project.gis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class GisApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(GisApplication.class, args);
    }

    // 如果您正在构建WAR文件并部署它，则需要WebApplicationInitializer
    // 继承WebApplicationInitializer并重写configure方法
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(GisApplication.class);
    }
}
