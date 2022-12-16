

function listarArticulos(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulos",settings)
    .then(response => response.json())
    .then(function(data){
        
            var articulos = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de Articulo</h1>
                </div>
                  
                <a href="#" onclick="registerFormA('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i> Articulo</a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Código</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Fecha Articulo</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">usuario</th>
                        <th scope="col">stock</th>
                        <th scope="col">preciov</th> precioc
                        <th scope="col">precioc</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
                    var con=0;
            for(const articulo of data){
                con++;
                console.log(articulo.nombre)
                articulos += `
                
                        <tr>
                            <th scope="row">${con}</th>
                            <td>${articulo.codigo}</td>
                            <td>${articulo.nombre}</td>
                            <td>${articulo.descripcion}</td>
                            <td>${articulo.fechaarticulo.substr(0,10)}</td>
                            <td>${articulo.categoria.nombreca}</td>
                            <td>${articulo.usuario.nombre}</td>
                            <td>${articulo.stock}</td>
                            <td>${articulo.preciov}</td>
                            <td>${articulo.precioc}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaArticulo('${articulo.codigo}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarArticulo('${articulo.codigo}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verArticulo('${articulo.codigo}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;
                
            }
            articulos += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = articulos;
    })
}

function eliminaArticulo(codigo){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulo/codigo/"+codigo,settings)
    .then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        listarArticulos();
        alertas("Se ha eliminado el articulo exitosamente!",2)
      })
}

function verModificarArticulo(codigo){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    };
    fetch(urlApi+"/categorias",settings)
    .then((response) => response.json())
    .then(function(da){
            if(da){  
                     fetch(urlApi + "/articulo/codigo/"+ codigo, settings)
                    .then((resp) => resp.json())
                    .then(function(articulo) {
                        var cadena = "";
                        var fechaDB = articulo.fecha;  
                console.log(articulo);                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Articulo</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <label for="codigo" class="form-label">Código</label>
                    <input type="text" class="form-control" name="codigo" id="codigo" required value="${articulo.codigo}"> <br>
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" required value="${articulo.nombre}"> <br>
                    <label for="descripcion"  class="form-label">LDescripción</label>
                    <input type="text" class="form-control" name="descripcion" id="descripcion" required value="${articulo.descripcion}"> <br>
                    <label for="fechaarticulo"  class="form-label">Fecha Articulo</label>
                    <input type="text" class="form-control" name="fechaarticulo" id="fechaarticulo" required value="${articulo.fechaarticulo.substr(0,10)}"> <br>
                    <label for="categoria" class="form-label">Categoria</label>
                    <select class="form-select" name="categoria" id="categoria">
                    ${console.log(da)}
                      <option value="${articulo.categoria.id}">${articulo.categoria.nombreca}</option>`;
                      
                      
                        for (const category of da) {
                                cadena += `
                        <option value="${category.id}">${category.nombreca}</option>`;
                        } 
                        cadena += `
                    </select>
                    <label for="cusuario" class="form-label">Usuario</label>
                    <input type="text" class="form-control" name="usuario" id="usuario" required value="${articulo.usuario.nombre}"> 
                    <label for="stock" class="form-label">Stock</label>
                    <input type="text" class="form-control" id="stock" name="stock" required value="${articulo.stock}"> 
                    <label for="preciov" class="form-label">Precio de Venta</label>
                    <input type="text" class="form-control" id="preciov" name="preciov" required value="${articulo.preciov}"> 
                    <label for="precioc" class="form-label">Precio de Compra</label>
                    <input type="text" class="form-control" id="precioc" name="precioc" required value="${articulo.precioc}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarArticulo('${articulo.codigo}')">Modificar
                    </button>
                </form>`;
            
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"))
            myModal.toggle();

            });

        }
    })
}

async function modificarArticulo(codigo) {
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    var jsonCategoria = {}
    for (var [k, v] of formData) {
        //convertimos los datos a json
        if(k=="categoria"){
          jsonCategoria["id"]=v;
          jsonData[k]=jsonCategoria
        }else{
          jsonData[k] = v;
        }
    }
    const request = await fetch(urlApi + "/articulo/codigo/" + codigo, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: localStorage.token,
        },
        body: JSON.stringify(jsonData),
    });
    listarArticulos();
    alertas("Se ha modificado el articulo exitosamente!", 1);
    document.getElementById("contentModal").innerHTML = "";
    var myModalEl = document.getElementById("modalUsuario");
    var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
    modal.hide();
}

function verArticulo(codigo) {
    validaToken();
    var settings = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    };

    fetch(urlApi+ "/articulo/codigo/" +codigo,settings)
    .then(response => response.json())
    .then(function(articulo){
    
            var cadena = "";
            if (articulo) {
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar articulo</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">co&oacute;digo: ${articulo.codigo}</li>
                    <li class="list-group-item">Art&iacute;culo: ${articulo.nombre}</li>
                    <li class="list-group-item">Descripcion: ${articulo.descripcion}</li>
                    <li class="list-group-item">Fecha de Articulo: ${articulo.fechaarticulo}</li>
                    <li class="list-group-item">Categor&iacute;a: ${articulo.categoria.nombreca}</li>
                    <li class="list-group-item">Creador del art&iacute;culo: ${articulo.usuario}</li>
                    <li class="list-group-item">Stock: ${articulo.stock}</li>
                    <li class="list-group-item">Valor de venta: $${articulo.preciov}</li>
                    <li class="list-group-item">Valor de compra: $${articulo.precioc}</li>
                </ul>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(
                document.getElementById("modalUsuario")
            );
            myModal.toggle();
        });
}

function registerFormA(auth = false) {
    var settings = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi + "/categorias", settings)
        .then(response => response.json())
        .then(function(data) {
            if (data) {
                fetch(urlApi + "/usuarios", settings)
                    .then(response => response.json())
                    .then(function(usuario) {
                        cadena = `
                    <div class="p-3 mb-2 bg-light text-dark">
                            <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Agregar Articulos</h1>
                        </div>
              
                            <form action="" method="post" id="myFormRegA">
                                <label for="codigo" class="form-label">Código</label>
                                <input type="text" class="form-control" name="codigo" id="codigo" > <br>
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" name="nombre" id="nombre" > <br>
                                <label for="descripcion"  class="form-label">Descripción</label>
                                <input type="text" class="form-control" name="descripcion" id="descripcion" > <br>
                                <label for="fechaarticulo"  class="form-label">Fecha Articulo</label>
                                <input type="date" class="form-control" name="fechaarticulo" id="fechaarticulo" > <br>
                                <label for="categoria" class="form-label">Categoria</label>
                                <select class="form-select" name="categoria" id="categoria">
                                <option value="0"></option>`;
                                    for (const category of data) {
                                            cadena += `
                                        <option value="${category.id}">${category.nombreca}</option>`;
                                    }
                                    cadena += `
                                </select>
                                <label for="cusuario" class="form-label">Usuario</label>
                                <select class="form-select" id="usuario" name="usuario" aria-label="Default select example">
                                    <option value="0"></option>
                                        `;
                                    for (const user of usuario) {
                                    console.log(user.id)
                                    cadena += `<option value="${(user.id)}">${user.nombre}</option>`;
                                    }
                                    cadena += `
                                </select><br>
                                <label for="stock" class="form-label">Stock</label>
                                <input type="text" class="form-control" id="stock" name="stock" r> <br>
                                <label for="preciov" class="form-label">Precio de Venta</label>
                                <input type="text" class="form-control" id="preciov" name="preciov"  > 
                                <label for="precioc" class="form-label">Precio de Compra</label>
                                <input type="text" class="form-control" id="precioc" name="precioc"  > <br>
                            
            <button type = "button" class = "btn btn-outline-info" onclick = "registrarArticulo('${auth}')" > Registrar </button> 
            </form>`;
                        document.getElementById("contentModal").innerHTML = cadena;
                        var myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
                        myModal.toggle();
                    })
            }
        })


}

async function registrarArticulo(auth = false) {
    var myForm = document.getElementById("myFormRegA");
    var formData = new FormData(myForm);
    var jsonData = {};
    var jsonCategoria = {};
    var jsonUser = {};
    for (var [k, v] of formData) {
        if (k == "categoria") {
            jsonCategoria["id"] = v;
            jsonData[k] = jsonCategoria

        } else if (k == "usuario") {
            jsonUser["id"] = v;
            jsonData[k] = jsonUser
        } else {
            jsonData[k] = v;
        }
    }
    console.log("data user ", jsonData);
    const request = await fetch(urlApi + "/articulo", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
            body: JSON.stringify(jsonData),
        })
        .then((response) => response.json())
        .then(function(respuesta) {
            console.log("respuesta peticion", respuesta);
        });
    if (auth) {
        listarArticulos();
    }
    alertas("Se ha registrado el articulo exitosamente!", 1);
    document.getElementById("contentModal").innerHTML = "";
    var myModalEl = document.getElementById("modalUsuario");
    var modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}