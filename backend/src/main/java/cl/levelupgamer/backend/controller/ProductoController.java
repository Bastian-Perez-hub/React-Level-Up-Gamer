package cl.levelupgamer.backend.controller;

import cl.levelupgamer.backend.dto.ProductoRequest;
import cl.levelupgamer.backend.model.Producto;
import cl.levelupgamer.backend.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @GetMapping("/{codigo}")
    public Producto obtener(@PathVariable String codigo) {
        return service.obtener(codigo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Producto crear(@Valid @RequestBody ProductoRequest datos) {
        return service.crear(datos);
    }

    @PutMapping("/{codigo}")
    public Producto actualizar(@PathVariable String codigo, @Valid @RequestBody ProductoRequest datos) {
        return service.actualizar(codigo, datos);
    }

    @DeleteMapping("/{codigo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String codigo) {
        service.eliminar(codigo);
    }
}