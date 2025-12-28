
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.redis.Redis;
import smartemergencydispatcher.service.RedisService.RedisServiceImp;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RedisServiceImpTest {

    @Mock
    private Redis redis;

    @Mock
    private Jedis jedisMock;

    private RedisServiceImp redisService;

    @BeforeEach
    void setUp() {
        try (MockedConstruction<Jedis> mockedJedis = Mockito.mockConstruction(Jedis.class,
                (mock, context) -> {
                    when(mock.publish(anyString(), anyString())).thenReturn(1L);
                })) {
            redisService = new RedisServiceImp(redis);
        }
    }

    @Test
    void testSetVehicleData_Success() {
        // Given
        VehicleDataDTO vehicleDataDTO = createTestVehicleDataDTO(1, VehicleStatus.AVAILABLE, 10.0, 20.0);
        when(redis.setItems(anyInt(), any(VehicleStatus.class), anyString(), anyString()))
                .thenReturn(1L);

        // When
        boolean result = redisService.setVehicleData(vehicleDataDTO);

        // Then
        assertTrue(result);
        verify(redis).setItems(eq(1), eq(VehicleStatus.AVAILABLE), eq("20.0"), eq("10.0"));
    }

    @Test
    void testSetVehicleData_Failure() {
        // Given
        VehicleDataDTO vehicleDataDTO = createTestVehicleDataDTO(1, VehicleStatus.AVAILABLE, 10.0, 20.0);
        when(redis.setItems(anyInt(), any(VehicleStatus.class), anyString(), anyString()))
                .thenReturn(-1L);

        // When
        boolean result = redisService.setVehicleData(vehicleDataDTO);

        // Then
        assertFalse(result);
    }

    @Test
    void testGetVehicleData_Available() {
        // Given
        Integer vehicleId = 1;
        Map<String, String> redisData = new HashMap<>();
        redisData.put("long", "20.0");
        redisData.put("lat", "10.0");
        redisData.put("status", "AVAILABLE");

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertNotNull(result);
        assertEquals(vehicleId, result.getId());
        assertEquals(VehicleStatus.AVAILABLE, result.getStatus());
        assertEquals(10.0, result.getLocationDTO().getLatitude());
        assertEquals(20.0, result.getLocationDTO().getLongitude());
    }

    @Test
    void testGetVehicleData_Busy() {
        // Given
        Integer vehicleId = 1;
        Map<String, String> redisData = new HashMap<>();
        redisData.put("long", "20.0");
        redisData.put("lat", "10.0");
        redisData.put("status", "BUSY");

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertEquals(VehicleStatus.BUSY, result.getStatus());
    }

    @Test
    void testGetVehicleData_Maintenance() {
        // Given
        Integer vehicleId = 1;
        Map<String, String> redisData = new HashMap<>();
        redisData.put("long", "20.0");
        redisData.put("lat", "10.0");
        redisData.put("status", "MAINTENANCE");

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertEquals(VehicleStatus.MAINTENANCE, result.getStatus());
    }

    @Test
    void testGetVehicleData_OnRoute() {
        // Given
        Integer vehicleId = 1;
        Map<String, String> redisData = new HashMap<>();
        redisData.put("long", "20.0");
        redisData.put("lat", "10.0");
        redisData.put("status", "ON_ROUTE");

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertEquals(VehicleStatus.ON_ROUTE, result.getStatus());
    }

    @Test
    void testGetVehicleData_NotFound() {
        // Given
        Integer vehicleId = 999;
        Map<String, String> redisData = new HashMap<>();

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertEquals(-1, result.getId());
        assertNull(result.getStatus());
        assertNull(result.getLocationDTO());
    }

    @Test
    void testGetVehicleData_InvalidStatus() {
        // Given
        Integer vehicleId = 1;
        Map<String, String> redisData = new HashMap<>();
        redisData.put("long", "20.0");
        redisData.put("lat", "10.0");
        redisData.put("status", "INVALID_STATUS");

        when(redis.getItems(vehicleId)).thenReturn(redisData);

        // When
        VehicleDataDTO result = redisService.getVehicleData(vehicleId);

        // Then
        assertEquals(vehicleId, result.getId());
        assertNull(result.getStatus()); // Status should be null for invalid value
    }

    @Test
    void testPublish() {
        // Setup
        try (MockedConstruction<Jedis> mockedJedis = Mockito.mockConstruction(Jedis.class,
                (mock, context) -> {
                    when(mock.publish(anyString(), anyString())).thenReturn(1L);
                })) {

            RedisServiceImp service = new RedisServiceImp(redis);

            // When
            service.publish("test-channel", "test-message");

            // Then
            verify(mockedJedis.constructed().get(1)).publish("test-channel", "test-message");
        }
    }

    @Test
    void testSubscribe() throws InterruptedException {
        // Setup
        try (MockedConstruction<Jedis> mockedJedis = Mockito.mockConstruction(Jedis.class,
                (mock, context) -> {
                    doNothing().when(mock).subscribe(any(JedisPubSub.class), anyString());
                })) {

            RedisServiceImp service = new RedisServiceImp(redis);

            // When
            service.subscribe("test-channel");

            // Give thread time to start
            Thread.sleep(100);

            // Then - verify subscribe was called
            verify(mockedJedis.constructed().get(0)).subscribe(any(JedisPubSub.class), eq("test-channel"));
        }
    }

    @Test
    void testSubscribe_ThreadStarts() {
        // Setup
        try (MockedConstruction<Jedis> mockedJedis = Mockito.mockConstruction(Jedis.class)) {

            RedisServiceImp service = new RedisServiceImp(redis);

            // When
            service.subscribe("test-channel");

            // Then - verify a thread is created
            // This test is more about verifying no exceptions are thrown
            assertDoesNotThrow(() -> service.subscribe("test-channel"));
        }
    }

    private VehicleDataDTO createTestVehicleDataDTO(Integer id, VehicleStatus status, double lat, double lon) {
        VehicleDataDTO dto = new VehicleDataDTO();
        dto.setId(id);
        dto.setStatus(status);
        dto.setLocationDTO(new LocationDTO(lat, lon));
        return dto;
    }
}