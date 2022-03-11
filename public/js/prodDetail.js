const log = console.log;

window.addEventListener("load", function(){
    

    let form = document.querySelector("form.FormCarrito")
    let cant = document.querySelector("input.pCant")
    let colors = [];
    let divC = document.querySelector("div.color div.text-danger")
    let size = [];
    let divS = document.querySelector("div.size div.text-danger")
    
    if(document.querySelectorAll('.pSize').length > 0){
        size = document.querySelectorAll('.pSize')
    }else{
        size = document.querySelector('.pSize')
    }

    if(document.querySelectorAll('.pCol').length > 0){
        colors = document.querySelectorAll('.pCol')
    }else{
        colors = document.querySelector('.pCol')
    }

    let name = document.querySelector(".nombre-prod").innerHTML

    let price = document.querySelector(".precio").innerHTML



    form.addEventListener("submit",(e)=>{
        divS.innerHTML = ""
        divC.innerHTML = ""
        
        let contS = 0;
        let siz;
        let contC = 0;
        let col;

        for (let i = 0; i < size.length; i++) {
            //console.log(size[i].checked)
            size[i].checked == true ?contS = contS + 1: ''
            size[i].checked == true ?siz = size[i].value: ''
        }

        if(contS > 1){
            divS.innerHTML = "<p>" + "Solo puedes seleccionar un talle" + "</p>"
            e.preventDefault();
        }else if(contS == 0){
            divS.innerHTML = "<p>" + "Tiene que seleccionar un talle" + "</p>"
            e.preventDefault();
        }

        for (let i = 0; i < colors.length; i++) {
            //console.log(size[i].checked)
            colors[i].checked == true ?contC = contC + 1: ''
            colors[i].checked == true ?col = colors[i].value : ''
        }

        if(contC > 1){
            divC.innerHTML = "<p>" + "Solo puedes seleccionar un color" + "</p>"
            e.preventDefault();
        }else if(contC == 0){
            divC.innerHTML = "<p>" + "Tiene que seleccionar un color" + "</p>"
            e.preventDefault();
        }

        let carrito = {col,siz,can:cant.value,name,price}

        console.log(carrito)

        localStorage.setItem('carrito',JSON.stringify(carrito));//Cambiar a json el objeto 
        // let Store=JSON.parse(localStorage.getItem('carrito'))//obtener el objeto de LocalStorage

    })



    


})