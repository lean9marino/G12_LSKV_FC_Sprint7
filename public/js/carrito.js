const log = console.log;
window.addEventListener("load", function(){


    if(localStorage.getItem('carrito') == null){
        let caja = document.querySelector(".det-compra")
        caja.style.display = "none";

    }else{
        let Store=JSON.parse(localStorage.getItem('carrito'));

        let titulo = document.querySelector(".nomProd")
        titulo.innerHTML += Store.name;

        document.querySelector(".Size").innerHTML += Store.siz;
        document.querySelector(".cant").innerHTML += Store.can;
        document.querySelector(".price").innerHTML += Store.price
        document.querySelector(".total").innerHTML += Store.price
    }


    

    

})