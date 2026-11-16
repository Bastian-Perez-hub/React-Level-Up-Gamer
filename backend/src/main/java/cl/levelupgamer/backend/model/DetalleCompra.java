package cl.levelupgamer.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalle_compra")
public class DetalleCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Texto simple, NO una relación con Producto (para conservar el historial)
    @Column(nullable = false, length = 20)
    private String codigo;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false)
    private int precioUnitario;

    @Column(nullable = false)
    private int subtotal;

    public DetalleCompra() {}

    public DetalleCompra(String codigo, int cantidad, int precioUnitario) {
        this.codigo = codigo;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = precioUnitario * cantidad;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public int getCantidad() { return cantidad; }
    public int getPrecioUnitario() { return precioUnitario; }
    public int getSubtotal() { return subtotal; }
}