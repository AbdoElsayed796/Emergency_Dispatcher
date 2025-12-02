package smartemergencydispatcher.mapper;

import ch.qos.logback.core.model.Model;
import org.mapstruct.Mapper;
import smartemergencydispatcher.dto.DtoPlaceholder;

@Mapper(componentModel = "spring")
public interface MapperPlaceholder {
    DtoPlaceholder toDto(ModelPlaceholder model);
    Model toModel(DtoPlaceholder dto);
}
