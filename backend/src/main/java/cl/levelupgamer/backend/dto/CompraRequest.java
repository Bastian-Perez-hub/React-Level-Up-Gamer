package cl.levelupgamer.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

// { "items": [ { "codigo": "JM001", "cantidad": 2 } ] }
public record CompraRequest(

        @NotEmpty(message = "La compra no tiene productos")
        List<@Valid Detalle> items
) {
    public record Detalle(
            @NotBlank(message = "El código del producto es obligatorio")
            String codigo,

            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad debe ser un número entero mayor a 0")
            Integer cantidad
    ) {}
}
