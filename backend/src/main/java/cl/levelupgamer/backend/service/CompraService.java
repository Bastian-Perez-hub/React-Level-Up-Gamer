package cl.levelupgamer.backend.service;

import cl.levelupgamer.backend.dto.CompraRequest;
import cl.levelupgamer.backend.dto.CompraResponse;
import cl.levelupgamer.backend.exception.ConflictoException;
import cl.levelupgamer.backend.exception.NoEncontradoException;
import cl.levelupgamer.backend.model.Compra;
import cl.levelupgamer.backend.model.DetalleCompra;
import cl.levelupgamer.backend.model.Producto;
import cl.levelupgamer.backend.repository.CompraRepository;
import cl.levelupgamer.backend.repository.ProductoRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompraService {

    private final CompraRepository compraRepository;
    private final ProductoRepository productoRepository;

    public CompraService(CompraRepository compraRepository, ProductoRepository productoRepository) {
        this.compraRepository = compraRepository;
        this.productoRepository = productoRepository;
    }

    // @Transactional: si algo lanza una excepción, TODO se deshace (incluido el stock ya descontado)
    @Transactional
    public CompraResponse crear(CompraRequest request) {

        // 1. Si el mismo código viene dos veces, sumamos las cantidades
        Map<String, Integer> pedido = new LinkedHashMap<>();
        for (CompraRequest.Detalle d : request.items()) {
            pedido.merge(d.codigo().trim().toUpperCase(), d.cantidad(), Integer::sum);
        }

        // 2. Validar TODO antes de tocar el stock: existencia y stock suficiente
        List<DetalleCompra> detalles = new ArrayList<>();
        for (Map.Entry<String, Integer> linea : pedido.entrySet()) {
            String codigo = linea.getKey();
            int cantidad = linea.getValue();

            Producto producto = productoRepository.findById(codigo)
                    .orElseThrow(() -> new NoEncontradoException("El producto " + codigo + " no existe"));

            if (cantidad > producto.getStock()) {
                throw new ConflictoException("Stock insuficiente para " + producto.getNombre());
            }

            // El precio sale de la base de datos, nunca del cliente
            detalles.add(new DetalleCompra(codigo, cantidad, producto.getPrecio()));
        }

        // 3. Descontar. La condición stock >= cantidad se revisa de nuevo dentro del UPDATE:
        //    es la red de seguridad por si otra compra se coló entre el paso 2 y este.
        for (DetalleCompra detalle : detalles) {
            int filas = productoRepository.descontarStock(detalle.getCodigo(), detalle.getCantidad());
            if (filas == 0) {
                // Al lanzar la excepción, la transacción se revierte completa
                throw new ConflictoException("Stock insuficiente para el producto " + detalle.getCodigo());
            }
        }

        // 4. Guardar la compra (y sus detalles, por el cascade)
        Compra compra = compraRepository.save(new Compra(Instant.now(), detalles));
        return CompraResponse.desde(compra);
    }

    // Todas las compras, las más recientes primero
    @Transactional(readOnly = true)
    public List<CompraResponse> listar() {
        return compraRepository.findAllByOrderByFechaDesc().stream()
                .map(CompraResponse::desde)
                .toList();
    }

    // Una compra por id (404 si no existe)
    @Transactional(readOnly = true)
    public CompraResponse obtener(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new NoEncontradoException("La compra " + id + " no existe"));
        return CompraResponse.desde(compra);
    }
}