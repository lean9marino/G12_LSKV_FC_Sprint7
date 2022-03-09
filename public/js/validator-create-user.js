window.addEventListener("load", function(){
    let form=document.querySelector("form.formLogin")
   
    form.addEventListener("submit", function(e){
        e.preventDefault();
        let error=[];
        let email=document.querySelector("input.email")
        let password=document.querySelector("input.password")
        if (email.value == "") {
           error.push("Este campo tiene que estar completo")
        } else if (email.value.length<=5) {
           error.push("Este campo tiene que tener al menos 5 caracteres")
        }
   
        if (password.value == "") {
           error.push("El campo de contraseña tiene que estar completo")
        } else if (password.value.length<=6) {
            error.push("El campo contraseña debe tener al menos 6 caracteres")
        }
   
        if (error.length>0) {
            e.preventDefault();
             let ulError=document.querySelector("div.errores ul")
             
            for (let i=0; i<error.length; i++) {
               ulError.innerHTML+= "<li>" +error[i]+ "</li>"
                
            }
        }
    })
   
})