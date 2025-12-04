package smartemergencydispatcher.dto.statsdto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseTimeDTO {
    private String type;
    private String color;
    private String avg;
    private String min;
    private String max;
    private long total;
}
