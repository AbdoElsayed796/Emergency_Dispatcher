package smartemergencydispatcher.dto.userdto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserLoginDTO {
    private String email;
    private String password;
}
