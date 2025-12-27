package smartemergencydispatcher.mapper;

import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.notification.NotificationResponse;
import smartemergencydispatcher.model.Notification;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {

    public NotificationResponse toDTO(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getRole(),
                notification.getType(),
                notification.getIncident() != null
                        ? notification.getIncident().getId()
                        : null,
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
    public List<NotificationResponse> toDTOList(List<Notification> notifications) {
        return notifications.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

}
