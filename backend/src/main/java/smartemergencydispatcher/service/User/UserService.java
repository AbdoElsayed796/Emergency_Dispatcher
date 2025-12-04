package smartemergencydispatcher.service.User;

import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;


import java.util.List;
public interface UserService {
    UserDTO getUserById(Integer id);
    UserDTO getUserByEmail(String email , String password);
    List<UserDTO> findAll();
    void deleteById(Long theId);
    UserDTO save(UserCreateDTO userCreateDTO);
    UserDTO updatePassword(Long id, UserDTO userDTO);

}
