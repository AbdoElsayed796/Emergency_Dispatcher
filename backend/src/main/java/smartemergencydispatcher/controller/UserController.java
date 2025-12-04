package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.userdto.UserCreateDTO;
import smartemergencydispatcher.dto.userdto.UserUpdateDTO;
import smartemergencydispatcher.service.UserService.UserService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }


    @PostMapping
    public UserDTO createUser(@RequestBody UserCreateDTO dto) {
        return userService.createUser(dto);
    }


    @PutMapping("/{id}")
    public UserDTO updateUser(@PathVariable Integer id, @RequestBody UserUpdateDTO dto) {
        return userService.updateUser(id, dto);
    }


    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
