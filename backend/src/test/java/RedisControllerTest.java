
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import smartemergencydispatcher.controller.RedisController;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.service.RedisService.RedisService;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class RedisControllerTest {

    @Mock
    private RedisService redisService;

    @InjectMocks
    private RedisController redisController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(redisController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testSaveVehicleData_Success() throws Exception {
        // Given
        VehicleDataDTO requestDTO = createTestVehicleDataDTO(1, VehicleStatus.AVAILABLE, 10.0, 20.0);
        when(redisService.setVehicleData(any(VehicleDataDTO.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/redis/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("vehicle data saved successfully"));

        verify(redisService).setVehicleData(any(VehicleDataDTO.class));
    }

    @Test
    void testSaveVehicleData_Failure() throws Exception {
        // Given
        VehicleDataDTO requestDTO = createTestVehicleDataDTO(1, VehicleStatus.AVAILABLE, 10.0, 20.0);
        when(redisService.setVehicleData(any(VehicleDataDTO.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/redis/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Failed to save vehicle data"));
    }

    @Test
    void testGetVehicleData_Success() throws Exception {
        // Given
        Integer vehicleId = 1;
        VehicleDataDTO responseDTO = createTestVehicleDataDTO(vehicleId, VehicleStatus.AVAILABLE, 10.0, 20.0);

        when(redisService.getVehicleData(vehicleId)).thenReturn(responseDTO);

        // When & Then
        mockMvc.perform(get("/redis/{id}", vehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("vehicle data is found successfully"))
                .andExpect(jsonPath("$.data.id").value(vehicleId));

        verify(redisService).getVehicleData(vehicleId);
    }

    @Test
    void testGetVehicleData_NotFound() throws Exception {
        // Given
        Integer vehicleId = 999;
        VehicleDataDTO responseDTO = new VehicleDataDTO();
        responseDTO.setId(-1);

        when(redisService.getVehicleData(vehicleId)).thenReturn(responseDTO);

        // When & Then
        mockMvc.perform(get("/redis/{id}", vehicleId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("cannot get vehicle data"))
                .andExpect(jsonPath("$.data.id").value(-1));
    }

    @Test
    void testPublishMessage() throws Exception {
        // Given
        String channel = "test-channel";
        String message = "test-message";

        doNothing().when(redisService).publish(anyString(), anyString());

        // When & Then
        mockMvc.perform(post("/redis/publish")
                        .param("channel", channel)
                        .param("message", message))
                .andExpect(status().isOk())
                .andExpect(content().string("Message published to channel: " + channel));

        verify(redisService).publish(channel, message);
    }

    @Test
    void testPublishMessage_EmptyParameters() throws Exception {
        // Given
        String channel = "";
        String message = "";

        doNothing().when(redisService).publish(anyString(), anyString());

        // When & Then
        mockMvc.perform(post("/redis/publish")
                        .param("channel", channel)
                        .param("message", message))
                .andExpect(status().isOk())
                .andExpect(content().string("Message published to channel: " + channel));
    }

    @Test
    void testSaveVehicleData_InvalidInput() throws Exception {
        // Test with invalid JSON
        String invalidJson = "{invalid json}";

        mockMvc.perform(post("/redis/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetVehicleData_InvalidId() throws Exception {
        // Given
        String invalidId = "abc"; // Not a number

        // When & Then
        mockMvc.perform(get("/redis/{id}", invalidId))
                .andExpect(status().isBadRequest()); // Spring will handle type mismatch
    }

    private VehicleDataDTO createTestVehicleDataDTO(Integer id, VehicleStatus status, double lat, double lon) {
        VehicleDataDTO dto = new VehicleDataDTO();
        dto.setId(id);
        dto.setStatus(status);
        dto.setLocationDTO(new LocationDTO(lat, lon));
        return dto;
    }
}