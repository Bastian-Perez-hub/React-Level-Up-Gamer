package cl.levelupgamer.backend.repository;

import cl.levelupgamer.backend.model.Compra;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    // Spring genera la consulta a partir del nombre del método:
    // "findAll" + "OrderByFechaDesc" = todas, ordenadas por fecha descendente.
    // @EntityGraph trae los detalles en la misma consulta (evita una consulta extra por cada compra).
    @EntityGraph(attributePaths = "items")
    List<Compra> findAllByOrderByFechaDesc();

    // Redefinimos findById para que también traiga los detalles
    @Override
    @EntityGraph(attributePaths = "items")
    Optional<Compra> findById(Long id);
}