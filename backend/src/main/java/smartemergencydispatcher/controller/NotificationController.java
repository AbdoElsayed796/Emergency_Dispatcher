package smartemergencydispatcher.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.notification.CreateNotificationRequest;
import smartemergencydispatcher.dto.notification.NotificationResponse;
import smartemergencydispatcher.model.enums.Role;
import smartemergencydispatcher.service.notification.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody CreateNotificationRequest request) {
        notificationService.createNotification(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{role}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByRole(@PathVariable Role role) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByRole(role);
        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Integer id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all/{role}")
    public ResponseEntity<?> markAllAsRead(@PathVariable Role role) {
        notificationService.markAllAsRead(role);
        return ResponseEntity.ok().build();
    }
}
