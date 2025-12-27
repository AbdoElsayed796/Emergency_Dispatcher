package smartemergencydispatcher.service.notification;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.notification.CreateNotificationRequest;
import smartemergencydispatcher.dto.notification.NotificationResponse;
import smartemergencydispatcher.model.Notification;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final IncidentRepository incidentRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   IncidentRepository incidentRepository) {
        this.notificationRepository = notificationRepository;
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void createNotification(CreateNotificationRequest request) {
        Notification notification = new Notification();
        notification.setRole(request.getRole());
        notification.setType(request.getType());

        if (request.getIncidentId() != null) {
            notification.setIncident(
                    incidentRepository.findById(request.getIncidentId())
                            .orElseThrow(() -> new RuntimeException("Incident not found"))
            );
        }

        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getNotificationsByRole(Role role) {
        return notificationRepository.findByRoleOrderByCreatedAtDesc(role)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Integer notificationId) {
        notificationRepository.markAsRead(notificationId);
    }

    @Override
    public void markAllAsRead(Role role) {
        notificationRepository.markAllAsRead(role);
    }

    private NotificationResponse mapToResponse(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(n.getId());
        dto.setRole(n.getRole());
        dto.setType(n.getType());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setIncidentId(
                n.getIncident() != null ? n.getIncident().getId() : null
        );
        return dto;
    }
}
