
import { CrudApi } from "./crudApi.js"
import { Loader } from "./loader.js"

let cartArray

let cartCounter = document.getElementById("cart-counter")
let cartIcon = document.getElementById("cart-icon")
const emptyCartDiv_Amount = document.getElementById("empty-cart-div--amount")

window.onload = async () => {

  //localStorage.clear()
  Loader.hideLoader()


  // if (!emptyCartDiv_Amount.classList.contains("d-none")) {
  //   emptyCartDiv_Amount.classList.add("d-none")
  // }


  cartArray = localStorage.getItem("cartArray")

  //prima controllo se non esiste e, nel caso, lo creo, sennò lo converto in oggetto
  if (!cartArray || cartArray === "null" || cartArray === "undefined") {
    cartArray = []
  }
  else {
    cartArray = JSON.parse(cartArray)
  }


  //se l'ho creato (ed è vuoto), o l'ho convertito in oggetto ed è vuoto
  if (cartArray.length === 0) {
    cartIcon.name = "cart-outline"
    emptyCartDiv_Amount.classList.remove("d-none")
    emptyCartDiv_Amount.classList.add("justify-content-center")
    emptyCartDiv_Amount.innerText = "Your cart is empty"

  } else {
    cartIcon.name = "cart"
  }

  cartCounter.innerText = cartArray.length




  const completeCartArray = cartArray.reduce((acc, curr) => {
    //cerca l'elemento per vedere se c'è già
    let existingItem = acc.find(item => item._id === curr._id)

    if (existingItem) {
      //se c'è aggiunge solo la quantità
      existingItem.quantity += 1
    } else {
      //altrimenti crea tutto
      acc.push({
        _id: curr._id,
        name: curr.name,
        brand: curr.brand,
        description: curr.description,
        imageUrl: curr.imageUrl,
        price: curr.price,
        userId: curr.userId,
        quantity: 1,
      })
    }

    return acc
  }, [])


  const totalAmount = completeCartArray.reduce((acc, curr) => {
    acc += Number(curr.price) * Number(curr.quantity)
    return acc

  }, 0)

  const target = document.querySelector('#target')
  completeCartArray.forEach(element => {
    const clone = createCardElements(element, target)
    addEventListenerToRemoveButton(element, clone)

  })

  if (cartArray.length!==0){
  emptyCartDiv_Amount.innerText = "TOTAL AMOUNT: " + totalAmount + "€"
  emptyCartDiv_Amount.style.fontWeight = "bold"
  
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

  const removeButton = clone.querySelector("#btn-remove")

  const quantitySpan = clone.querySelector("#product-quantity")


  productImage.src = el.imageUrl
  productName.textContent = el.name
  productBrand.textContent = el.brand
  productPrice.textContent = el.price + "€ ea."
  quantitySpan.textContent = el.quantity

  removeButton.setAttribute('data-id', el._id)

  brandInCard.href = `details.html?id=${el._id}`
  productNameInCard.href = `details.html?id=${el._id}`



  target.appendChild(clone)

  return clone
}



function addEventListenerToRemoveButton(el, cardClone) {


  const removeButton = cardClone.querySelector('#btn-remove')

  removeButton.addEventListener("click", async () => {

    //al click sul bottone recupero l'id del prodotto che ho salvato nell'attributo "data-id"
    const elementIdFromRemoveButton = removeButton.getAttribute("data-id")

    Swal.fire({
      title: 'Confirm item removal',
      text: `Are you sure you want to remove the element with id ${elementIdFromRemoveButton}: ${el.brand} ${el.name}, quantity = ${el.quantity} from the cart?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: false
    }).then(async (result) => {

      if (result.isConfirmed) {

        //elimino div più prossimo al bottone di questa card che contiene tutti gli elementi della card stessa,
        //in modo da rimuoverlo graficamente prima di visualizzare la conferma di avvenuta eliminazione e ricaricare la pagina
        const cardToDelete = removeButton.closest('.product-card')
        cardToDelete.remove()

        //tiene nell'array tutti gli elementi il cui id è diverso da quello da rimuovere
        cartArray = cartArray.filter(item => item._id !== elementIdFromRemoveButton)

        //aggiorno il local storage
        localStorage.setItem("cartArray", JSON.stringify(cartArray))


        if (cartArray.length === 0) {

          cartIcon.name = "cart-outline"
          emptyCartDiv_Amount.innerText = "Your cart is empty"
          cartCounter.innerText = cartArray.length
        }




        Swal.fire({
          title: 'Removed from the cart!',
          text: `The element with id = ${elementIdFromRemoveButton} has been removed from the cart.`,
          icon: 'success'
        })

          //se non metto il seguente then, ricarica la pagina immediatamente dopo aver mostrato la conferma di
          //eliminazione, che passa così velocemente da non essere visibile
          .then(() => {

            location.reload()
          })
      }


    })

  })

}