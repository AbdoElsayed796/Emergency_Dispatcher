package com.example.Smart_Emergency_Dispatcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class SmartEmergencyDispatcherApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartEmergencyDispatcherApplication.class, args);
	}

}
