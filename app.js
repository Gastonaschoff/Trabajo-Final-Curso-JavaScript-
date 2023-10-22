
class Producto {
    constructor(id, marca, nombre, precio, imagen) {
        this.id = id;
        this.marca = marca;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
    }
  }
  
 
  class BaseDeDatos {
    constructor() {

        this.productos = [];
        //
        this.cargarRegistros();
    }
  
    async cargarRegistros(){
      const resultado = await fetch("./json/productos.json");
      this.productos = await resultado.json();
      cargarProductos(this.productos);
    }
  

  traerRegistros() {
    return this.productos;
    }
  
  
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
    }
  
  
  registrosPorNombre(palabra) {
    return this.productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(palabra.toLowerCase()) || producto.marca.toLowerCase().includes(palabra.toLowerCase()));
    }
  
  registrosPorCategoria(marca){
    return this.productos.filter((producto) => producto.marca == marca);
    }
  }
  
 
  class Carrito {
    constructor() {
   
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
       
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.cantidadProductos = 0; 
        this.listar();
    }
  
 
  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
    }
  
 
  agregar(producto) {
    const productoEnCarrito = this.estaEnCarrito(producto);

    if (!productoEnCarrito) {
        this.carrito.push({ ...producto, cantidad: 1 });
    } else {

        productoEnCarrito.cantidad++;
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
    }
  

  quitar(id) {
    const indice = this.carrito.findIndex((producto) => producto.id === id);

    if (this.carrito[indice].cantidad > 1) {
        this.carrito[indice].cantidad--;
    } else {
   
        this.carrito.splice(indice, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(this.carrito));

    this.listar();
    }
  

  vaciar() {
    this.total = 0;
    this.cantidadProductos = 0;
    this.carrito = [];
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }
  

  listar() {

    this.total = 0;
    this.cantidadProductos = 0;
    divCarrito.innerHTML = "";

    for (const producto of this.carrito) {
        divCarrito.innerHTML += `
            <div class="productoCarrito">
                <div class="imagen">
                  <img src="images/${producto.imagen}" />
                </div>
                <h2>${producto.marca}</h2>
                <h2>${producto.nombre}</h2>
                <p>$${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class="btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
            </div>
        `;

    this.total += producto.precio * producto.cantidad;
    this.cantidadProductos += producto.cantidad;
    }
    if (this.cantidadProductos > 0){

      botonComprar.style.display = "block";
    } else{

      botonComprar.style.display = "none";
    }
  

    const botonesQuitar = document.querySelectorAll(".btnQuitar");
 
    for (const boton of botonesQuitar) {
        boton.addEventListener("click", (event) => {
        event.preventDefault();
        const idProducto = Number(boton.dataset.id);
        this.quitar(idProducto);
        });
    }
  
    spanCantidadProductos.innerText = this.cantidadProductos;
    spanTotalCarrito.innerText = this.total;
    }
  }
  
  
  const spanCantidadProductos = document.querySelector("#cantidadProductos");
  const spanTotalCarrito = document.querySelector("#totalCarrito");
  const divProductos = document.querySelector("#productos");
  const divCarrito = document.querySelector("#carrito");
  const inputBuscar = document.querySelector("#inputBuscar");
  const botonCarrito = document.querySelector("#ocultar");
  const botonComprar = document.querySelector("#botonComprar");
  const botonesCategorias = document.querySelectorAll(".btnCategoria");
  

  const bd = new BaseDeDatos();
  
 
  const carrito = new Carrito();
  
  botonesCategorias.forEach((boton) =>{
    boton.addEventListener("click", () =>{
      const marca = boton.dataset.marca;

      const botonSeleccionado = document.querySelector(".seleccionado");
      botonSeleccionado.classList.remove("seleccionado");
  
      boton.classList.add("seleccionado");
      if (marca == "Todos"){
        cargarProductos(bd.traerRegistros());
      }else{
        cargarProductos(bd.registrosPorCategoria(marca));
      }
    })
  });
  
 
  cargarProductos(bd.traerRegistros());
  

  function cargarProductos(productos) {
 
    divProductos.innerHTML = "";
 
    for (const producto of productos) {
        divProductos.innerHTML += `
            <div class="producto">
              <div class="imagen">
                <img src="images/${producto.imagen}" />
              </div>
              <h2>${producto.marca}</h2>
              <h4>${producto.nombre}</h4>
              <p class="precio">$${producto.precio}</p>
            <a href="#" class="btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
            </div>
    `;
    }
  
 
  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  
  
  for (const boton of botonesAgregar) {
    boton.addEventListener("click", (event) => {

        event.preventDefault();
   
        const idProducto = Number(boton.dataset.id);
      
        const producto = bd.registroPorId(idProducto);
     
        carrito.agregar(producto);
    
      Toastify({
        text: `Se ha añadido ${producto.nombre} al carrito`,
        position: "center",
        gravity: "top",
        duration: 30000,
        style: {
          background: "linear-gradient(to right, #A51C30, #000)",
          color: "#f5f5f5",
          margin: "15px",
          padding: "5px",
          position: "fixed",  
        },
      }).showToast();
      });
    }
  }
  

  inputBuscar.addEventListener("input", (event) => {
    event.preventDefault();
    const palabra = inputBuscar.value;
    const productos = bd.registrosPorNombre(palabra);
    cargarProductos(productos);
  });
  
  
  
  botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
  });
  
 
  botonComprar.addEventListener("click", (event) => {
    event.preventDefault();
  
    Swal.fire({
      title: "¿Seguro que desea comprar los productos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, seguro",
      cancelButtonText: "No, no quiero",
    }).then((result) => {
      if (result.isConfirmed) {
        carrito.vaciar();
        Swal.fire({
          title: "¡Compra realizada!",
          icon: "success",
          text: "Su compra fue realizada con éxito.",
          timer: 2000,
        });
      }
    });
  });