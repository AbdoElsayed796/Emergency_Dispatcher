package smartemergencydispatcher;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // This should scan all sub-packages automatically
public class SmartEmergencyDispatcherApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartEmergencyDispatcherApplication.class, args);
    }
}