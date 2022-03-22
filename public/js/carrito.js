const log = console.log;
window.addEventListener("load", function(){
    log(localStorage.getItem("carrito"))

    if(localStorage.getItem('carrito') == null){
        document.querySelector(".det-compra").style.display = "none";
        document.querySelector(".bEnv").style.display = "none";

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