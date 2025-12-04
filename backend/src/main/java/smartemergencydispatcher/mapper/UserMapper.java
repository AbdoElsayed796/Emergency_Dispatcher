package smartemergencydispatcher.mapper;


import org.mapstruct.Mapper;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.model.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
}
