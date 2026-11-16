package cl.levelupgamer.backend.dto;

import cl.levelupgamer.backend.model.Compra;
import java.time.Instant;
import java.util.List;

public record CompraResponse(Long id, Instant fecha, List<Detalle> items, int total) {

    public record Detalle(String codigo, int cantidad, int precioUnitario, int subtotal) {}

    // Convierte la entidad en la respuesta que espera el frontend
    public static CompraResponse desde(Compra compra) {
        List<Detalle> detalles = compra.getItems().stream()
                .map(d -> new Detalle(d.getCodigo(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal()))
                .toList();
        return new CompraResponse(compra.getId(), compra.getFecha(), detalles, compra.getTotal());
    }
}