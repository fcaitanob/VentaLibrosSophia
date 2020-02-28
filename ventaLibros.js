//----------------------------------------------------
// usar programa en daps de https://base.aepps.com/
// contratos en https://contracts.aepps.com/#/
// el gif del loader es de giphy
// saldo al 27/2: 4,9922976 AE.. 4,9918438.., 4,99139082
// curso y desafio: https://dacade.org/ae-dev-101/introduction
//----------------------------------------------------


const contractSource = `
//////////// ejercicio venta de libros desde casa
  
payable contract VentaLibros =
  
  record libro = {
    nombre: string,
    autor: string,
    precio: int,
    emailVendedor: string,
    estado: string,
    dirCreador: address}

  record state = {
    libros: map(int , libro) , 
    librosCnt: int}
  
  entrypoint init()  = {
    libros = {} , 
    librosCnt = 0}

  stateful entrypoint inicializo()  = 
    put (state {libros = {} , librosCnt = 0}  ) 

  entrypoint get_libros_cnt() : int =
    state.librosCnt

  stateful entrypoint inc_libros_cnt() =
    let indice = get_libros_cnt() + 1
    put (state {librosCnt = indice})

  stateful entrypoint set_libros_cnt(nro : int) =
    put (state {librosCnt = nro})

  stateful entrypoint add_libro(nombre' : string, autor' : string, precio' : int, emailVendedor' : string) = 
    let nuevoIndice = get_libros_cnt() + 1
    let nuevoLibro= {nombre = nombre',
      autor = autor',
      precio = precio',
      emailVendedor = emailVendedor',
      estado = "A LA VENTA",
      dirCreador = Call.caller}
    put (state {libros[nuevoIndice] = nuevoLibro,
      librosCnt = nuevoIndice})

  entrypoint get_libro(nroLibro : int) : libro = 
    switch(Map.lookup(nroLibro, state.libros))
      None => abort("No existe el libro solicitado")
      Some(xxx) => xxx
              
  payable stateful entrypoint comproLibro(nroLibro : int) =
    let libroAux = get_libro(nroLibro) 
    Chain.spend(libroAux.dirCreador, libroAux.precio)
    let updatedLibros = state.libros{ [nroLibro].estado = "VENDIDO" }
    put(state{ libros = updatedLibros })



` ;


//direccion del smart contract en testnet de aeternity blockchain
const contractAddress = `ct_2nw6YwUr44bBGYRKnnmQCWQNuUWMQ2zig6P4iZ9io2rQbj821m`;
//Create variable for client so it can be used in different functions
var client = null;
//global array para los libros
var librosArray = [];
//Cantidad de libros
var librosCnt = 999;

//Create a asynchronous read call for our smart contract
async function callStatic(func, args) {
  //Create a new contract instance that we can interact with
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  //Make a call to get data of smart contract func, with specefied arguments
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  //Make another call to decode the data received in first call
  const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;
} 

//Create a asynchronous write call for our smart contract
async function contractCall(func, args, value) {
  console.log( "debug: funcion contractCall, value: " + value);
  console.log( "debug: funcion contractCall, args: " + args);
	
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  
  
  console.log( "debug: funcion contractCall, func: " + func);
  console.log( "debug: funcion contractCall, value: " + value);
  console.log( "debug: funcion contractCall, args: " + args);
  
  
  //Make a call to write smart contract func, with aeon value input
  const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));

  console.log( "debug: funcion contractCall, calledSet: " + calledSet);


  return calledSet;
} 


function ocultarCargando(){
	document.getElementById('loader').style.display = 'none';
}

function mostrarCargando(){
	document.getElementById('loader').style.display = 'block';
}

function ocultarCargandoCompra(){
	document.getElementById('loaderCompra').style.display = 'none';
}

function mostrarCargandoCompra(){
	document.getElementById('loaderCompra').style.display = 'block';
}



//Inicio.....................
async function  inicio() {

  // ocultar cargando compra
  ocultarCargandoCompra();



  // cargando....
  mostrarCargando();
  
  //inicializo vector
  librosArray = [];

  
  
  console.log( "debug: funcion inicio, librosCnt inicial: " + librosCnt);
  client =  await Ae.Aepp();

  librosCnt = 888 ;
  console.log( "debug: funcion inicio, librosCnt inicial2: " + librosCnt);
  librosCnt =  await callStatic('get_libros_cnt', []);
  console.log( "debug: funcion inicio, librosCnt inicial3: " + librosCnt);

  
  //cargo los libros en un array global
  var i = 0;
  for (let i = 1; i <= librosCnt; i++) {
    const libro = await callStatic('get_libro', [i]);
	console.log( "debug: funcion inicio, librosCnt inicial4 en loop: " + libro.nombre);

    librosArray.push({
      libroNombre: libro.nombre,
      libroAutor: libro.autor,
      libroPrecio: libro.precio,
      libroEmailVendedor: libro.emailVendedor,
      libroEstado: libro.estado,
      libroDirCreador: libro.dirCreador,
	  indice: i
    }) ;
	console.log( "debug: funcion inicio, librosCnt inicial5 en loop: " + librosArray[i-1].libroNnombre);

  }
  renderLibros(); 
  
  // cargando....
  ocultarCargando();


}






  
function renderLibros() {

	console.log("debug: funcion renderLibros, cantidad de libros: " + librosCnt);
	var div = document.getElementById('agregarLibros');
	div.innerHTML = "";

	for (var i=1; i<=librosCnt; i++) 
		{ 
		console.log("debug: funcion renderLibros, nombre del libro dentro del for1:  " + librosArray[i-1].libroNombre);

		texto = `		
		<table style="text-align:center;">
		<tr>
		<p>.....................................</p>
		</tr>
		<tr>
		<p align="center"> Nro de libro: ` + i + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroNombre + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroAutor + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroPrecio + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroEmailVendedor + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroEstado + `</p>
		</tr>
		<tr>
		<p align="center">` + librosArray[i-1].libroDirCreador + `</p>
		</tr>
		</table>
		
		` ;
		div.innerHTML += texto;
		//document.write(texto) ; 
		console.log("debug: funcion renderLibros, nombre del libro dentro del for2:  " + librosArray[i-1].libroNombre);
		}
	//$('#librosParaVender').html(rendered);
} 



async function compro_libro_pr(nro) {

	alert("valor del parametroxxxx: " + nro);
	console.log( "debug: funcion compro_libro, i: " + nro);
	console.log( "debug: funcion compro_libro, precio: " + librosArray[nro-1].libroPrecio);
	var value = librosArray[nro-1].libroPrecio ;
	var nroLibro = nro ;
	console.log( "debug: funcion compro_libro, precioVariable: " + value);


	await contractCall('comproLibro', [nroLibro], value);
	//await inicio();	// recarga pantalla


}




async function compro_libro() {
	
	
	var i = document.getElementById("libroNro").value ;
	document.getElementById("libroNro").value = null ;
	
	alert("xxxxxxxxxxx> " + i);

	if (i > 0 && i <= librosCnt) { // proceso la compra si el indice es valido

			mostrarCargandoCompra();

			console.log( "debug: funcion compro_libro, i: " + i);
			console.log( "debug: funcion compro_libro, precio: " + librosArray[i-1].libroPrecio);
			var value = librosArray[i-1].libroPrecio ;
			var nroLibro = i ;
			console.log( "debug: funcion compro_libro, precioVariable: " + value);
			let index = event.target.id;



			await contractCall('comproLibro', [nroLibro], value);
			
			//Hide the loading animation after async calls return a value
			//const foundIndex = librosArray.findIndex(libro => libro.index == event.target.id);
		  

			ocultarCargandoCompra();

			await inicio();	// recarga pantalla
	} 

}



async function inc_libros_cnt() {
	
	console.log("debug: ingreso a inc_libros_cnt");
	await contractCall('inc_libros_cnt', [], 0);
	librosCnt = await callStatic('get_libros_cnt', []);
	alert("Cantidad de libros: " + librosCnt);
	txt = "Cantidad de libros: " + librosCnt ;
    document.getElementById("demoDos").innerHTML = txt;

} 
 
async function alta_libro() {
	
	// cargando....
	mostrarCargando();

	
	//await contractCall('inc_libros_cnt', [], 0);
	//librosCnt = await callStatic('get_libros_cnt', []);
	var txt = "Nombre del libro: " + document.getElementById("libroNombre").value ;
	txt = txt + " Autor: " + document.getElementById("libroAutor").value ;
	txt = txt + " Precio: " + document.getElementById("libroPrecio").value ;
	txt = txt + " Correo: " + document.getElementById("libroVendedorCorreo").value ;


    //document.getElementById("demoTres").innerHTML = txt;
	console.log("debug: " + txt);
	
	var nombre = document.getElementById("libroNombre").value ;
	var autor = document.getElementById("libroAutor").value ;
	var precio = document.getElementById("libroPrecio").value ;
	var correo = document.getElementById("libroVendedorCorreo").value ;
	await contractCall('add_libro', [nombre, autor, precio, correo], 0);

	document.getElementById("libroNombre").value = "";
	document.getElementById("libroAutor").value = "";
	document.getElementById("libroPrecio").value = "";
	document.getElementById("libroVendedorCorreo").value = "";
	
	await inicio();	// recarga pantalla
	
} 
  
  
