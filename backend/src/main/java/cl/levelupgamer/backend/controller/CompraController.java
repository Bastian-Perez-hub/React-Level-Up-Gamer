package cl.levelupgamer.backend.controller;

import cl.levelupgamer.backend.dto.CompraRequest;
import cl.levelupgamer.backend.dto.CompraResponse;
import cl.levelupgamer.backend.service.CompraService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService service;

    public CompraController(CompraService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CompraResponse crear(@Valid @RequestBody CompraRequest request) {
        return service.crear(request);
    }
        @GetMapping
    public List<CompraResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public CompraResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }
}
