package cl.levelupgamer.backend.repository;

import cl.levelupgamer.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductoRepository extends JpaRepository<Producto, String> {

    // Descuenta stock SOLO si alcanza. Devuelve cuántas filas cambió:
    // 1 = se descontó, 0 = no había stock suficiente.
    @Modifying(clearAutomatically = true)
    @Query("UPDATE Producto p SET p.stock = p.stock - :cantidad "
         + "WHERE p.codigo = :codigo AND p.stock >= :cantidad")
    int descontarStock(@Param("codigo") String codigo, @Param("cantidad") int cantidad);
}