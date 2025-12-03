package smartemergencydispatcher.dto.userdto;

import lombok.*;
import smartemergencydispatcher.model.enums.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private Role role;
}
