package smartemergencydispatcher.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserUpdateDTO;
import smartemergencydispatcher.mapper.UserMapper;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;
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
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO createUser(UserCreateDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // store hashed in real apps
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());

        return mapToDTO(userRepository.save(user));
    }
    @Override
    public UserDTO updateUser(Integer id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update only allowed fields
        user.setName(dto.getName());
        user.setPassword(dto.getPassword());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());

        return mapToDTO(userRepository.save(user));
    }
    @Override
    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(User user) {
        UserMapper userMapper = new UserMapper();
        return userMapper.toDTO(user);
    }
}
