package cl.levelupgamer.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "compra")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Instant fecha;

    @Column(nullable = false)
    private int total;

    // cascade ALL: al guardar la compra se guardan sus detalles automáticamente.
    // @JoinColumn crea la columna compra_id en detalle_compra.
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "compra_id")
    private List<DetalleCompra> items = new ArrayList<>();

    public Compra() {}

    public Compra(Instant fecha, List<DetalleCompra> items) {
        this.fecha = fecha;
        this.items = items;
        this.total = items.stream().mapToInt(DetalleCompra::getSubtotal).sum();
    }

    public Long getId() { return id; }
    public Instant getFecha() { return fecha; }
    public int getTotal() { return total; }
    public List<DetalleCompra> getItems() { return items; }
}