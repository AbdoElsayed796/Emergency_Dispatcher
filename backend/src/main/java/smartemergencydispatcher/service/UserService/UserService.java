package smartemergencydispatcher.service.UserService;

import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserUpdateDTO;
import smartemergencydispatcher.model.enums.Role;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    List<UserDTO> getAllUsersByRole(Role role);
    UserDTO createUser(UserCreateDTO dto);
    UserDTO updateUser(Integer id, UserUpdateDTO dto);
    void deleteUser(Integer id);
}
