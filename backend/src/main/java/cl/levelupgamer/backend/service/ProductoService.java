package cl.levelupgamer.backend.service;

import cl.levelupgamer.backend.dto.ProductoRequest;
import cl.levelupgamer.backend.exception.ConflictoException;
import cl.levelupgamer.backend.exception.NoEncontradoException;
import cl.levelupgamer.backend.model.Producto;
import cl.levelupgamer.backend.repository.ProductoRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoService {

    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Producto obtener(String codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new NoEncontradoException("El producto " + codigo + " no existe"));
    }

    @Transactional
    public Producto crear(ProductoRequest datos) {
        if (datos.codigo() == null || datos.codigo().isBlank()) {
            throw new IllegalArgumentException("El código es obligatorio");
        }
        String codigo = datos.codigo().trim().toUpperCase();

        if (repository.existsById(codigo)) {
            throw new ConflictoException("Ya existe un producto con el código " + codigo);
        }

        Producto nuevo = new Producto(
                codigo,
                datos.nombre().trim(),
                datos.descripcion().trim(),
                datos.precio(),
                datos.stock());
        return repository.save(nuevo);
    }

    // El código no se puede cambiar: es el identificador del producto
    @Transactional
    public Producto actualizar(String codigo, ProductoRequest datos) {
        Producto producto = obtener(codigo);
        producto.setNombre(datos.nombre().trim());
        producto.setDescripcion(datos.descripcion().trim());
        producto.setPrecio(datos.precio());
        producto.setStock(datos.stock());
        return repository.save(producto);
    }

    @Transactional
    public void eliminar(String codigo) {
        Producto producto = obtener(codigo); // lanza 404 si no existe
        repository.delete(producto);
    }
}