package smartemergencydispatcher.dto.userdto;


import lombok.*;
import smartemergencydispatcher.model.enums.Role;



@Data
@NoArgsConstructor
@AllArgsConstructor
class UserUpdateDTO {
    private String name;
    private String email;
    private String phone;
    private Role role;
}
