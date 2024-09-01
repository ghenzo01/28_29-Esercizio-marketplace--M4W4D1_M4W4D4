
import { CrudApi } from "./crudApi.js"
import { Loader } from "./loader.js"

let cartArray


let cartCounter = document.getElementById("cart-counter")
let cartIcon = document.getElementById("cart-icon")

window.onload = async () => {

    // localStorage.clear()

    cartArray = localStorage.getItem("cartArray")

    if (!cartArray || cartArray === "null" || cartArray === "undefined") {
        cartArray = []
        cartIcon.name = "cart-outline"
    }
    else {
        cartArray = JSON.parse(cartArray)
    }


    cartCounter.innerText = cartArray.length

    cartArray.length === 0 || cartArray === "undefined" || cartArray === "null" ? cartIcon.name = "cart-outline" : cartIcon.name = "cart"






    try {
        Loader.showLoader()
        const products = await CrudApi.getProducts()
        Loader.hideLoader()

        //elemento che conterrà le cards
        const target = document.querySelector('#target')

        addEventListenerToSearchButton(products)



        products.forEach(el => {
            const cardClone = createCardElements(el, target)

            addEventListenerToButtonAddToCart(el, cardClone)


        })

    } catch (error) {
        Loader.hideLoader()
        console.log("errore ", error)
        Swal.fire({
            title: 'Server get error',
            text: 'An error occurred while trying to retrieve the products: ' + error,
            icon: 'error',
            confirmButtonText: 'Ok',
        })

            .then((result) => {

                if (result.isConfirmed) {
                    console.log("ritorno")
                    return

                }

            })


    }

}


function createCardElements(el, target) {

    let temp = document.getElementsByTagName("template")[0]//cerco il tag template presente in pagina. 
    let clone = temp.content.cloneNode(true)//crea un clone del contenuto del tag template. 

    const div = document.createElement("div")

    div.append(clone)
    clone = div.firstElementChild

    const productImage = clone.querySelector('.product-img')
    const productName = clone.querySelector('.product-name')
    const productBrand = clone.querySelector('.product-brand')
    const productPrice = clone.querySelector('.product-price')

    const detailsTarget = clone.querySelector('#details-target')
    const productNameInCard = clone.querySelector('#product-name-in-card')
    const brandInCard = clone.querySelector('#brand-in-card')
    const imgDetailsLink = clone.querySelector('#img-details-link')


    const buttonDetails = clone.querySelector('#btn-details')
    const buttonAddToCart = clone.querySelector('#btn-add-to-cart')

    productImage.src = el.imageUrl
    productName.textContent = el.name
    productBrand.textContent = el.brand
    productPrice.textContent = el.price + "€"

    buttonDetails.href = `details.html?id=${el._id}`
    imgDetailsLink.href = `details.html?id=${el._id}`
    brandInCard.href = `details.html?id=${el._id}`
    productNameInCard.href = `details.html?id=${el._id}`


    target.appendChild(clone)

    return clone
}



function addEventListenerToButtonAddToCart(el, cardClone) {

    const buttonAddToCart = cardClone.querySelector("#btn-add-to-cart")

    buttonAddToCart.addEventListener("click", () => {
        cartArray.push(el)
        cartCounter.innerText = cartArray.length

        if (cartArray.length > 0) {
            cartIcon.name = "cart"
        }

        localStorage.setItem("cartArray", JSON.stringify(cartArray))




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

            })
        } else {
            if (noResultsDiv.classList.contains("d-none")) {
                noResultsDiv.classList.remove("d-none")
            }

            noResultsDiv.textContent = "No results to show"
        }


    })

}






// OGGETTO RESTITUITO:
// [
//     {
//         "_id": "66ce44bf69406a00150d95db",
//         "name": "nome10",
//         "description": "breve descrizione",
//         "brand": "nome brand",
//         "imageUrl": "https://picsum.photos/200/300",
//         "price": 12,
//         "userId": "66cdbedd69406a00150d950d",
//         "createdAt": "2024-08-27T21:27:27.325Z",
//         "updatedAt": "2024-08-27T21:27:27.325Z",
//         "__v": 0
//     },
//     {
//         "_id": "66ce450169406a00150d95dd",
//         "name": "nome editato2",
//         "description": "breve descrizione editata2",
//         "brand": "nome brand editato2",
//         "imageUrl": "https://linkieditato2/image.jpg",
//         "price": 122,
//         "userId": "66cdbedd69406a00150d950d",
//         "createdAt": "2024-08-27T21:28:33.981Z",
//         "updatedAt": "2024-08-28T01:16:22.054Z",
//         "__v": 0
//     },
//     {
//         "_id": "66ce473369406a00150d95e2",
//         "name": "nome editato",
//         "description": "breve descrizione editata",
//         "brand": "nome brand editato",
//         "imageUrl": "https://linkieditato/image.jpg",
//         "price": 12,
//         "userId": "66cdbedd69406a00150d950d",
//         "createdAt": "2024-08-27T21:37:55.895Z",
//         "updatedAt": "2024-08-27T22:01:45.402Z",
//         "__v": 0
//     }
// ]






