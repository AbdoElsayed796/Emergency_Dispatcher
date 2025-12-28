package smartemergencydispatcher.dto.notification;

import lombok.*;
import smartemergencydispatcher.model.enums.NotificationType;
import smartemergencydispatcher.model.enums.Role;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class NotificationResponse {
    private Integer id;
    private Role role;
    private NotificationType type;
    private Integer incidentId;
    private boolean read;
    private LocalDateTime createdAt;
}