package cl.levelupgamer.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// Lo que el frontend envía al crear o editar. Un record es una clase inmutable compacta.
// "codigo" solo se usa al crear; al editar, el código viene en la URL.
public record ProductoRequest(
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion,

        @NotNull(message = "El precio es obligatorio")
        @Min(value = 1, message = "El precio debe ser un número entero mayor a 0")
        Integer precio,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock debe ser un número entero, 0 o mayor")
        Integer stock
) {}