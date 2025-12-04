package smartemergencydispatcher.dto.userdto;

import lombok.*;
import smartemergencydispatcher.model.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserCreateDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
}
