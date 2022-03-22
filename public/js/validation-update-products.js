const log = console.log
window.addEventListener("load", function(){
    let name = document.querySelector('input.name')
    let nameError = document.querySelector("div.text-danger-name");
    let errorName = undefined;

    console.log('ENTREE');

    name.addEventListener('blur', function(e){
        if (name.value == '') {
            errorName = 'Este campo tiene que estar completo';
        } else if (name.value.length <5) {
            errorName = 'Este campo tiene que tener al menos 10 caracteres';
        } else { 
            errorName = "";
        }
        if (errorName != undefined) {
            nameError.innerHTML = '<p>' + errorName + '</p>'
        }
    })
    


    let price = document.querySelector('input.price')
    let priceError = document.querySelector("div.text-danger-price");
    let errorPrice = undefined;

    price.addEventListener('blur', function(e){
        if (price.value <= 0) {
            errorPrice = 'Este campo tiene que estar completo';
        } else errorPrice = ''
        if (errorPrice != undefined) {
            priceError.innerHTML = '<p>' + errorPrice + '</p>'
        }
    })
    


    // let category = document.querySelector('select.category')
    // let categoryError = document.querySelector("div.text-danger-category");
    // let errorCategory;

    // category.addEventListener('submit', function(e){
    //     if (category.value == 0 || category.value == '') {
    //         errorCategory = 'Debe seleccionar una categoria válida';
    //     }
    //     if (errorCategory != undefined) {
    //         categoryError.innerHTML = '<p>' + errorCategory + '</p>'
    //     }
    // })
    


    // let style = document.querySelector('select.styles')
    // let styleError = document.querySelector("div.text-danger-style");
    // let errorStyle;

    // style.addEventListener('submit', function(e) {
    //     if (style.value == 0 || style.value == '') {
    //         errorStyle = 'Debe seleccionar un estilo válido'
    //     }
    //     if (errorStyle != undefined) {
    //         styleError.innerHTML = '<p>' + errorStyle + '</p>'
    //     }
    // })
   


    // let color = document.querySelector('input.chk-color')
    // let colorError = document.querySelector("div.text-danger-color");
    // let errorColor = undefined;

    // color.addEventListener('blur', function(e){
    //     if (!color.value.checked){
    //         errorColor = 'Debe seleccionar un color válido'
    //     }
    //     if (errorColor != undefined) {
    //         colorError.innerHTML = '<p>' + errorColor + '</p>'
    //     }
    // })


    // let size = document.querySelector('input.chk-size')
    // let sizeError = document.querySelector("div.text-danger-size");
    // let errorSize = undefined;

    // size.addEventListener('blur', function(e){
    //     if (!size.value.checked){
    //         errorSize = 'Debe seleccionar un talle válido'
    //     }
    //     if (errorSize != undefined) {
    //         sizeError.innerHTML = '<p>' + errorSize + '</p>'
    //     }
    // })
    

    let image = document.querySelector('input.imagesPrinSec')
    let imageError = document.querySelector("div.text-danger-img");
    let errorImage = undefined;
    log('image', image)
    image.addEventListener('blur', function(e){
        if (image.value == ""){
            errorImage = 'Debe seleccionar una imagen'
        }else {
            errorImage = "";
        }
        if (errorImage != undefined) {
            imageError.innerHTML = '<p>' + errorImage + '</p>'
        }
    })
   

    let description = document.querySelector('textarea.description')
    let descError = document.querySelector("div.text-danger-description");
    let errorDesc = undefined;
    description.addEventListener('blur',function(e){
        if (description.value == '') {
            errorDesc = 'Este campo tiene que estar completo'
        } else if (description.value.length <= 30) {
            errorDesc = 'Este campo tiene que tener al menos 15 caracteres'
        }else errorDesc = "";
        
        if (errorDesc != undefined) {
            descError.innerHTML = '<p>' + errorDesc + '</p>'
        }
    })
 
})