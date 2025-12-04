package smartemergencydispatcher.service.User;

import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserUpdateDTO;

import java.util.List;
public interface UserService {
    UserDTO getUserById(Integer id);
    UserDTO getUserByEmail(String email , String password);
    UserDTO save(UserCreateDTO userCreateDTO);
    UserDTO updatePassword(Long id, UserDTO userDTO);
    List<UserDTO> getAllUsers();
    UserDTO createUser(UserCreateDTO dto);
    UserDTO updateUser(Integer id, UserUpdateDTO dto);
    void deleteUser(Integer id);

}
