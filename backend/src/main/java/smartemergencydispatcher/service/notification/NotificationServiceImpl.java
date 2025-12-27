package smartemergencydispatcher.service.notification;

import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.notification.CreateNotificationRequest;
import smartemergencydispatcher.dto.notification.NotificationResponse;
import smartemergencydispatcher.mapper.NotificationMapper;
import smartemergencydispatcher.model.Notification;
import smartemergencydispatcher.model.enums.Role;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.NotificationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final IncidentRepository incidentRepository;
    private final NotificationMapper notificationMapper ;
    private final SimpMessagingTemplate messagingTemplate;
    public NotificationServiceImpl(NotificationRepository notificationRepository,
                                   IncidentRepository incidentRepository, NotificationMapper notificationMapper, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.incidentRepository = incidentRepository;
        this.notificationMapper = notificationMapper;
        this.messagingTemplate = messagingTemplate;
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
        getNotificationsByRole(request.getRole());
    }

    @Override
    public List<NotificationResponse> getNotificationsByRole(Role role) {
        List<Notification> notifications = notificationRepository.findUnreadByRoleOrdered(role);
        List<NotificationResponse> notificationResponses = notificationMapper.toDTOList(notifications);
        messagingTemplate.convertAndSend("/topic/notification", notificationResponses);
        return notificationMapper.toDTOList(notifications);
    }

    @Override
    public void markAsRead(Integer notificationId) {
        notificationRepository.markAsRead(notificationId);
        Role role = notificationRepository.findRoleById(notificationId);
        getNotificationsByRole(role);
    }

    @Override
    public void markAllAsRead(Role role) {
        notificationRepository.markAllAsRead(role);
        getNotificationsByRole(role);
    }
    @Override
    public void updateNotificationStatus(Integer incidentId){

       notificationRepository.markIncidentResolvedAndUnread(incidentId);
       Role role = notificationRepository.findRoleByIncidentId(incidentId);
       getNotificationsByRole(role);
    }
}
