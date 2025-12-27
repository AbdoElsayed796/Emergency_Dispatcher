package smartemergencydispatcher.service.notification;




import smartemergencydispatcher.dto.notification.CreateNotificationRequest;
import smartemergencydispatcher.dto.notification.NotificationResponse;
import smartemergencydispatcher.model.enums.Role;

import java.util.List;

public interface NotificationService {

    void createNotification(CreateNotificationRequest request);

    List<NotificationResponse> getNotificationsByRole(Role role);

    void markAsRead(Integer notificationId);

    void markAllAsRead(Role role);
    public void updateNotificationStatus(Integer notificationId);
}
