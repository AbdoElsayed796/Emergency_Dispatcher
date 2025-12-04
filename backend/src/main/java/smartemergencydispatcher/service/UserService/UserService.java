package smartemergencydispatcher.service.UserService;

import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserUpdateDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    UserDTO createUser(UserCreateDTO dto);
    UserDTO updateUser(Integer id, UserUpdateDTO dto);
    void deleteUser(Integer id);
}
