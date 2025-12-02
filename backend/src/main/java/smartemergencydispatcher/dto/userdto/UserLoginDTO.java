package smartemergencydispatcher.dto.userdto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
class UserLoginDTO {
    private String email;
    private String password;
}
