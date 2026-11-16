package cl.levelupgamer.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "producto")
public class Producto {

    // El código ES la clave primaria (JM001, CO001...). No hay id autogenerado,
    // porque el frontend ya identifica los productos por código.
    @Id
    @Column(length = 20)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, length = 500)
    private String descripcion;

    // Pesos chilenos: enteros, sin decimales
    @Column(nullable = false)
    private int precio;

    @Column(nullable = false)
    private int stock;

    public Producto() {} // JPA lo exige

    public Producto(String codigo, String nombre, String descripcion, int precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public int getPrecio() { return precio; }
    public void setPrecio(int precio) { this.precio = precio; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
}