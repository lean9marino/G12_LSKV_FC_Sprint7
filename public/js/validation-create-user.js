const log = console.log;
window.addEventListener("load", function(){
    let userName = document.querySelector("input.userName");
    let userError = document.querySelector("div.text-danger-userName");
    let error_userName = undefined;

    userName.addEventListener("blur", function(e){
        if( userName.value == "" ){
            error_userName = "Este campo tiene que estar completo";
        }else if( userName.value.length < 3 ){
            error_userName = "Este campo tiene que tener al menos 3 caracteres";
        }else  error_userName = "";
        if (error_userName != undefined) {
            userError.innerHTML = "<p>" + error_userName + "</p>"
            log('entre en userName')
        }
    })

    let passError = document.querySelector('div.text-danger-password');
    let passError2 = document.querySelector('div.text-danger-password2')
    let password = document.querySelector("input.password");
    let confirmPassword = document.querySelector('input.confirmPassword');

    password.addEventListener('blur',function(e){
        if( password.value != confirmPassword.value ){ 
            log('Entre en contrasenia')
            error_password = ('Las contraseñas debe conincidir en ambos campos');
            passError.innerHTML = "<p>" + error_password + "</p>";
            passError2.innerHTML = "<p>" + error_password + "</p>";
        }else {
            log("Son igualessss!!! ")
            passError.innerHTML = "";
            passError2.innerHTML = "";
        }
        if( password.value.length < 6 ){
            log('Entre en contrasenia')
            error_password = ('La contraseña de tener almenos 6 caracteres');
            passError.innerHTML = "<p>" + error_password + "</p>";
        } else passError.innerHTML = "";

        regex = /^(?=.*\d)(?=.*[a-záéíóúüñ]).*[A-ZÁÉÍÓÚÜÑ]/;

        //Se muestra un texto válido/inválido a modo de ejemplo
        if (regex.test(password.value)) {
          
        } else {
          passError.innerText = "Debe tener como minimo una masyuscula, una minuscula y un numero";
        }
    })

    confirmPassword.addEventListener('blur',function(e){
        if(confirmPassword.value.length < 6){
            log('Entre en contrasenia')
            error_password = ('La contraseña de tener almenos 6 caracteres');
            passError2.innerHTML = "<p>" + error_password + "</p>";
        }else passError2.innerHTML ="";
        if( password.value != confirmPassword.value ){ 
            log('Entre en contrasenia')
            error_password = ('Las contraseñas debe conincidir en ambos campos');
            passError.innerHTML = "<p>" + error_password + "</p>";
            passError2.innerHTML = "<p>" + error_password + "</p>";
        }else {
            log("Son igualessss!!! ")
            passError.innerHTML = "";
            passError2.innerHTML = "";
        }
    })
        
    let surError = document.querySelector('div.text-danger-surname');
    let surname = document.querySelector('input.surname');
    let error_surname; 
    surname.addEventListener('blur',function(e){
        if(surname.value == "") {
            error_surname = ("Debe escribir un apellido")
        }else { 
            error_surname = ""
        }
        
        if(error_surname != undefined){
            surError.innerHTML = "<p>" + error_surname + "</p>";
            log('Entre en surname')
        }
    })
    
    let nameError = document.querySelector('div.text-danger-name');
    let name = document.querySelector('input.name'); 
    let error_name = undefined;
    name.addEventListener('blur',function(e){
        if( name.value == "" ){ 
            error_name = ("Debe escribir un nombre");
        }else if(name.value.length < 2){
            error_name = ("El nombre debe tener almenos 3 caracteres");
            log("ENTRE en name con menos de 3")
        }else error_name ="";

        if(error_name != undefined){
            nameError.innerHTML = "<p>" + error_name + "</p>";
            log('Entre en name')
        }
    })
        
    let emailError = document.querySelector('div.text-danger-email')
    let email = document.querySelector('input.email'); 
    let error_email = undefined;
    email.addEventListener('blur',function(e){
        if(email.value == "") {
            error_email = ('Debe completar este campo')
        }else { 
            error_email = "";
        }
        if(error_email != undefined){
            emailError.innerHTML = "<p>" + error_email + "</p>";
            log('Entre en email')
        }
        emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    //Se muestra un texto a modo de ejemplo, luego va a ser un icono
    if (emailRegex.test(email.value)) {
    
    } else {
      emailError.innerText = "Debe de tener un [@] y terminar con [.com] ";
    }
    })
    
    let dniError = document.querySelector('div.text-danger-dni');
    let DNI = document.querySelector('input.dni'); 
    let error_DNI = undefined;
    DNI.addEventListener('blur',function(e){
        if(String(DNI.value) == "") {
            error_DNI = 'Debe completar este campo';
        }else if(String(DNI.value).length <= 6){ 
            error_DNI = "Debe tener almenos 6 numeros" ;
        }else error_DNI = ""
        if(error_DNI != undefined){
            dniError.innerHTML = "<p>" + error_DNI + "</p>";
            log('Entre en DNI')
        }
    })
    
    let fechaError = document.querySelector('div.text-danger-fNac');
    let fecha_nac = document.querySelector('input.fNac'); 
    let error_fecha = undefined;
    fecha_nac.addEventListener('blur',function(e){
        if(fecha_nac.value =="") {
            error_fecha = ('Debe completar este campo');
        }else { 
            error_fecha = "";
        }
        if(error_fecha != undefined){
            fechaError.innerHTML = "<p>" + error_fecha + "</p>";
            log('Entre en fechaNac')
        }
    })
})