//funciones js para el modulo de categorias

function listarCategorias(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/categorias",settings)
    .then(response => response.json())
    .then(function(data){
        
            var categorias = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de categorias</h1>
                </div>
                  
                <a href="#" onclick="registerForm('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"> Categoria</i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Category name</th>
                        <th scope="col">Description category</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
            for(const categoria of data){
                console.log(categoria.nombreca)
                categorias += `
                
                        <tr>
                            <th scope="row">${categoria.id}</th>
                            <td>${categoria.nombreca}</td>
                            <td>${categoria.descripcionca}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaCategoria('${categoria.id}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarCategoria('${categoria.id}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            
                            </td>
                            
                        </tr>
                    `;
                
            }
            categorias += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = categorias;
    })
}

function eliminaCategoria(id){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/categoria/"+id,settings)
    .then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        listarCategorias();
        alertas("Se ha eliminado la categoria exitosamente!",2)
      })
}

function verModificarCategoria(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/categoria/"+id,settings)
    .then(response => response.json())
    .then(function(categoria){
            var cadena='';
            if(categoria){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Modificar Categoria</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <input type="hidden" name="id" id="id" value="${categoria.id}">
                    <label for="nombreca" class="form-label">Category name</label>
                    <input type="text" class="form-control" name="nombreca" id="nombreca" required value="${categoria.nombreca}"> <br>
                    <label for="descripcionca"  class="form-label">Category description</label>
                    <input type="text" class="form-control" name="descripcionca" id="descripcionca" required value="${categoria.descripcionca}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCategoria('${categoria.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarCategoria(id){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/categoria/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarCategorias();
    alertas("Se ha modificado la categoria exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function registerForm(auth=false){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Categoria</h1>
            </div>
              
            <form action="" method="post" id="myFormRegC">
                <input type="hidden" name="id" id="id">
                <label for="nombreca" class="form-label">Category Name</label>
                <input type="text" class="form-control" name="nombreca" id="nombreca" required> <br>
                <label for="descripcionca"  class="form-label">Category Description</label>
                <input type="text" class="form-control" name="descripcionca" id="descripcionca" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="crearCategoria('${auth}')">Agregar</button>
            </form>`;
            console.log(cadena);
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}


async function crearCategoria(auth=false){
    var myForm = document.getElementById("myFormRegC");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    
    console.log("data user ",jsonData);
    const request = await fetch(urlApi+"/categoria", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(function(respuesta){
        console.log("respuesta peticion", respuesta)
    });
    if(auth){
        listarCategorias();
    }
    alertas("Se ha registrado la categoria exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
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