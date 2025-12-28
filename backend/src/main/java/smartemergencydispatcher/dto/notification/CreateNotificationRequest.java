package smartemergencydispatcher.dto.notification;

import lombok.*;
import smartemergencydispatcher.model.enums.NotificationType;
import smartemergencydispatcher.model.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class CreateNotificationRequest {

    private Role role;
    private NotificationType type;
    private Integer incidentId; // nullable

}