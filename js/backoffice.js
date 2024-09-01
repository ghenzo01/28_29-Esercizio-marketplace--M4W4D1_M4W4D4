

import { CrudApi } from "./crudApi.js"
import { Loader } from "./loader.js"



window.onload = async () => {

    //pulsante per andare nella sezione per aggiungere/modificare prodotti, accede all'interfaccia add-update in modalità add
    const buttonAdd = document.querySelector('#add-btn')

    buttonAdd.addEventListener("click", () => {
        const paramName = "mode"  //modalità con cui accedo alla pagina
        const paramValue = "add"  //accedo in modalità add, cioè per aggiungere prodotti

        const targetUrl = `./add-update.html?${paramName}=${paramValue}`

        //pagina su cui atterrerò dopo aver cliccato il bottone
        window.location.href = targetUrl
    })






    try {

        Loader.showLoader()
        const products = await CrudApi.getProducts()
        Loader.hideLoader()


        //elemento che conterrà le cards
        const target = document.querySelector('#target')

        addEventListenerToSearchButton(products)



        products.forEach(el => {
            const cardClone = createCardElements(el, target)

            addEventListenerToDeleteButton(el, cardClone)
            addEventListenerToEditButton(el, cardClone, products)


        })

    } catch (error) {
        Loader.hideLoader()
        buttonAdd.classList.add("d-none")

        console.log(error)

        Swal.fire({
            title: 'Server get error',
            text: 'An error occurred while trying to retrieve the products: ' + error,
            icon: 'error',
            confirmButtonText: 'Ok',
        })

            .then((result) => {

                if (result.isConfirmed) {

                    return

                }

            })


    }


}



function createCardElements(el, target) {

    let temp = document.getElementsByTagName("template")[0] //cerco il mio template per questa pagina. 
    let clone = temp.content.cloneNode(true) //clono il contenuto del template

    const div = document.createElement("div")

    div.append(clone) //appendo a un nuovo div
    clone = div.firstElementChild //estraggo dal div

    const productImage = clone.querySelector('.product-img')
    const productName = clone.querySelector('.product-name')
    const productBrand = clone.querySelector('.product-brand')
    const productPrice = clone.querySelector('.product-price')

    const detailsTarget = clone.querySelector('#details-target')
    const productNameInCard = clone.querySelector('#product-name-in-card')
    const brandInCard = clone.querySelector('#brand-in-card')
    const imgDetailsLink = clone.querySelector('#img-details-link')

    const buttonDelete = clone.querySelector('.btn-close.delete-btn') //lo prendo solo se ha entrambe le classi
    const buttonEdit = clone.querySelector('.btn-edit')

    productImage.src = el.imageUrl
    productName.textContent = el.name
    productBrand.textContent = el.brand
    productPrice.textContent = el.price + "€"

    imgDetailsLink.href = `details.html?id=${el._id}`
    brandInCard.href = `details.html?id=${el._id}`
    productNameInCard.href = `details.html?id=${el._id}`


    //aggiungo l'id come attributo "data-id" ad entrambi i bottoni per poterlo recuperare dopo e permettere di recuperarlo anche ad altre
    //eventiuali procedure, se la cosa dovesse servire
    buttonDelete.setAttribute('data-id', el._id)
    buttonEdit.setAttribute('data-id', el._id)

    target.appendChild(clone)

    return clone
}





function addEventListenerToDeleteButton(el, cardClone) {


    const buttonDelete = cardClone.querySelector('.btn-close.delete-btn')

    buttonDelete.addEventListener("click", async () => {

        //al click sul bottone recupero l'id del prodotto che ho salvato nell'attributo "data-id"
        const elementIdFromDeleteButton = buttonDelete.getAttribute("data-id")

        Swal.fire({
            title: 'Confirm item deletion',
            text: `Are you sure you want to delete the element with id ${elementIdFromDeleteButton}: ${el.brand} ${el.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            reverseButtons: false
        }).then(async (result) => {

            try {

                if (result.isConfirmed) {

                    Loader.showLoader()
                    await CrudApi.deleteProduct(elementIdFromDeleteButton)
                    Loader.hideLoader()

                    //elimino il div più prossimo al bottone di questa card che contiene tutti gli elementi della card stessa,
                    //in modo da rimuoverlo graficamente prima di visualizzare la conferma di avvenuta eliminazione e ricaricare la pagina
                    const cardToDelete = buttonDelete.closest('.product-card')
                    cardToDelete.remove()

                    Swal.fire({
                        title: 'Deleted!',
                        text: `The element with id = ${elementIdFromDeleteButton} has been deleted.`,
                        icon: 'success'
                    })

                        //se non metto il seguente then, ricarica la pagina immediatamente dopo aver mostrato la conferma di
                        //eliminazione, che passa così velocemente da non essere visibile
                        .then(() => {

                            location.reload()
                        })
                }
            } catch (error) {
                Loader.hideLoader()

                Swal.fire({
                    title: 'Server delete error',
                    text: 'An error occurred while trying to delete the product: ' + error,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        return
                    }
                })

            }

        })

    })

}


function addEventListenerToEditButton(el, cardClone, products) {

    const buttonEdit = cardClone.querySelector('.btn-edit')


    buttonEdit.addEventListener("click", () => {

        //al click sul bottone recupero l'id del prodotto che ho salvato nell'attributo "data-id"
        const elementIdFromEditButton = buttonEdit.getAttribute("data-id")

        //estraggo l'oggetto relativo alla card cliccata e lo salvo nel sessionStorage, per poterlo riprendere dalla pagina add-update
        //in questo modo evito una chiamata get
        const key = "productObject"
        const objectToSave = products.find(product => product._id === el._id)

        //il sessionStorage salva solo in formato stringa, converto l'oggetto in stringa con .stringify
        sessionStorage.setItem(key, JSON.stringify(objectToSave))

        const paramName = "mode"  //modalità con cui accedo alla pagina
        const paramValue = "edit"  //accedo in modalità edit, cioè per modificare prodotti

        const targetUrl = `./add-update.html?${paramName}=${paramValue}&key=${key}`


        window.location.href = targetUrl

    })


}


function addEventListenerToSearchButton(products) {

    const buttonSearch = document.querySelector('#search-btn')
    const textboxSearch = document.querySelector('#search-text-box')


    buttonSearch.addEventListener("click", (button) => {

        //si trova all'interno di un form, devo sovrascrivere il comportamento di default
        button.preventDefault()



        const stringTosearch = textboxSearch.value.toLowerCase()
        const arrayToShow = products.filter(element => element.name.toLowerCase().includes(stringTosearch) || element.brand.toLowerCase().includes(stringTosearch) || element.description.toLowerCase().includes(stringTosearch))

        console.log(arrayToShow)

        //elemento che contiene le cards
        const target = document.querySelector('#target')
        target.innerHTML = ""
        const noResultsDiv = document.querySelector('#no-results-div')

        if (arrayToShow.length) {
            if (!noResultsDiv.classList.contains("d-none")) {
                noResultsDiv.classList.add("d-none")
            }

            arrayToShow.forEach(element => {
                const cardClone = createCardElements(element, target)

                addEventListenerToDeleteButton(element, cardClone)
                addEventListenerToEditButton(element, cardClone, arrayToShow)

            })
        } else {
            if (noResultsDiv.classList.contains("d-none")) {
                noResultsDiv.classList.remove("d-none")
            }

            noResultsDiv.textContent = "No results to show"
        }


    })

}
