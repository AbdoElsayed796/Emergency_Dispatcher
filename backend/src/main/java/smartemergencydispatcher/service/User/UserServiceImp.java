package smartemergencydispatcher.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.mapper.UserMapper;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.repository.UserRepository;

import java.util.List;
@Service
public class UserServiceImp implements UserService{
    private final UserMapper userMapper ;
    private final UserRepository userRepository;
    @Autowired
    public UserServiceImp(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.userMapper = new UserMapper();
    }
    @Override
    public UserDTO getUserById(Integer id) {
        return null;
    }

    @Override
    public UserDTO getUserByEmail(String email , String password) {

        User user = userRepository.getUserByEmail(email);
        if(user == null){
            return null;
        }
        if(!user.getPassword().equals(password)){
            return null;
        }
        return userMapper.toDTO(user);
    }
    @Override
    public List<UserDTO> findAll() {
        return List.of();
    }

    @Override
    public void deleteById(Long theId) {

    }

    @Override
    public UserDTO save(UserCreateDTO userCreateDTO) {
        User user = userMapper.toEntity(userCreateDTO);
        User saved = userRepository.save(user);
        UserDTO res = userMapper.toDTO(saved) ;
        return res;
    }
    @Override
    public UserDTO updatePassword(Long id, UserDTO userDTO) {
        return null;
    }
}
