package smartemergencydispatcher.service.StationService;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.stationdto.StationDTO;
import smartemergencydispatcher.dto.stationdto.StationCreateDTO;
import smartemergencydispatcher.dto.stationdto.StationUpdateDTO;
import smartemergencydispatcher.mapper.StationMapper;
import smartemergencydispatcher.model.Station;
import smartemergencydispatcher.repository.StationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StationServiceImpl implements StationService {

    private final StationRepository stationRepository;
    private final StationMapper stationMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public List<StationDTO> getAllStations() {
        return stationRepository.findAll()
                .stream()
                .map(stationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StationDTO createStation(StationCreateDTO dto) {
        Station station = new Station();
        station.setType(dto.getType());
        station.setName(dto.getName());
        station.setPhone(dto.getPhone());
        station.setLocation(convertToPoint(dto.getLocation()));

        return stationMapper.toDTO(stationRepository.save(station));
    }

    @Override
    public StationDTO updateStation(Integer id, StationUpdateDTO dto) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));

        station.setType(dto.getType());
        station.setName(dto.getName());
        station.setPhone(dto.getPhone());
        station.setLocation(convertToPoint(dto.getLocation()));

        return stationMapper.toDTO(stationRepository.save(station));
    }

    @Override
    public void deleteStation(Integer id) {
        stationRepository.deleteById(id);
    }

    private Point convertToPoint(LocationDTO dto) {
        return geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
    }
}
