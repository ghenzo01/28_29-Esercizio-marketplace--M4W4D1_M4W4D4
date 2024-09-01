export class Loader{

    static showLoader(){

        const loader = document.querySelector('#loader')
        loader.classList.remove('d-none')
        
    }
    
    static hideLoader(){
        const loader = document.querySelector('#loader')
        loader.classList.add('d-none')
    }
}