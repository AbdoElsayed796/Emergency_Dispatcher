package smartemergencydispatcher.dto.userdto;


import lombok.*;
import smartemergencydispatcher.model.enums.Role;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String name;
    private String password;
    private String phone;
    private Role role;
}
