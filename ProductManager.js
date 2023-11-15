const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.loadProductsFromDisk();
    }

    // Cargar productos desde el archivo al inicializar la instancia
    loadProductsFromDisk() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    // Guardar productos en el archivo
    saveProductsToDisk() {
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(producto) {
        if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || !producto.stock) {
            console.log("Todos los campos son obligatorios.");
            return;
        }
    
        // Verificar si ya existe un producto con el mismo nombre
        if (this.products.some((p) => p.title === producto.title)) {
            console.log("El producto ya existe.");
            return;
        }
    
        // Asignar un id autoincrementable
        producto.id = this.getNextProductId();
    
        this.products.push(producto);
        this.saveProductsToDisk();
        console.log("Producto agregado exitosamente.");
    }
    

    updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            const PropiedadesRequeridas = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    
            // Verifico que tengan las mismas propiedades 
            const Validado = PropiedadesRequeridas.every(prop => updatedProduct.hasOwnProperty(prop));
    
            if (Validado) {
                // Mantener el mismo ID
                updatedProduct.id = id;
                this.products[productIndex] = updatedProduct;
                this.saveProductsToDisk();
                return updatedProduct;
            } else {
                console.log("Las Caracteristicas del producto no coinciden con el destino.");
                return null;
            }
        } else {
            return null; // Producto no encontrado
        }
    }
    

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProductsToDisk();
            return true; // Producto eliminado con éxito
        } else {
            return false; // Producto no encontrado
        }
    }

    getNextProductId() {
        if (this.products.length === 0) {
            return 1;
        } else {
            const maxId = Math.max(...this.products.map(product => product.id));
            return maxId + 1;
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const producto = this.products.find((p) => p.id === id);
        return producto || null;
    }
}

// Creacion de una instancia de la clase "ProductManager"
const manager = new ProductManager('products.json');

// Llamando al metodo "getProducts" recien creada la instancia
console.log(manager.getProducts());
//exporto ProductManager
module.exports = ProductManager;
