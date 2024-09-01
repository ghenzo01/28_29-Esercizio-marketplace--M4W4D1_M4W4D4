

import { CrudApi } from "./crudApi.js"
import { Loader } from "./loader.js"

window.onload = async () => {

    //---
    //i seguenti elementi si vedranno solo quando si accede alla pagina per 
    //effettuare un update
    const id_div = document.getElementById("product-id")
    const dates_div = document.getElementById("product-dates")
    const id_span = document.getElementById("id")
    const insertionDate_span = document.getElementById("insertion-date")
    const lastUpdateDate_span = document.getElementById("last-update-date")
    //---

    const brand = document.getElementById("brand")
    const name = document.getElementById("name")
    const price = document.getElementById("price")
    const imageUrl = document.getElementById("imageUrl")
    const description = document.getElementById("description")

    const modeDescriptionHeader = document.getElementById("mode-description-header")
    const send_btn = document.getElementById("send-btn")

    //utilizzo di URLSearchParams per estrarre il parametro che mi indica cosa è venuto a fare l'utente sulla pagina (aggiungere o modificare)
    const urlParams = new URLSearchParams(window.location.search)
    const mode = urlParams.get('mode')

    if (mode === "add") {
        modeDescriptionHeader.innerText = "Complete the fields for the new product you want to add"
    } else if (mode === "edit") {

        modeDescriptionHeader.innerText = "Edit the fields you want to update"

        //prendo il nome della chiave sotto cui ho salvato l'oggetto
        const key = urlParams.get('key')


        //prelevo dal sessionStorage la stringa e la riconverto in oggetto
        const stringObject = sessionStorage.getItem(key)
        const element = JSON.parse(stringObject)


        id_div.classList.remove("d-none")
        dates_div.classList.remove("d-none")

        id_span.innerText = element._id
        insertionDate_span.innerText = element.createdAt
        lastUpdateDate_span.innerText = element.updatedAt





        brand.value = element.brand
        name.value = element.name
        price.value = element.price
        imageUrl.value = element.imageUrl
        description.value = element.description

    }







    send_btn.addEventListener("click", async (event) => {

        //impedisce il comportamento predefinito del form che sarebbe quello di effettuare il submit dei dati
        //e altre cose che non voglio che faccia
        event.preventDefault()


        //verifica se tutti i campi obbligatori sono compilati
        if (!brand.value.trim() || !name.value.trim() || !price.value.trim() || !imageUrl.value.trim() || !description.value.trim()) {
            Swal.fire({
                title: 'Mandatory fields',
                text: `Enter a valid value for all mandatory fields (marked with an asterisk)`,
                icon: 'warning',
                confirmButtonText: 'Ok',
                reverseButtons: false
            })
            return
        }

        //controllo del valore inserito per il prezzo
        if (isNaN(Number(price.value)) || Number(price.value) === 0) {
            Swal.fire({
                title: 'Invalid price',
                text: 'Please enter a valid numeric value',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
            return
        }

        //controllo che il link all'immagine sia un link diretto ad un formato di immagine valido
        const extensions = ['.jpg', '.jpeg', '.gif', '.png', '.bmp', '.webp', '.tiff']

        if (!extensions.some(extension => imageUrl.value.toLowerCase().endsWith(extension))) {
            Swal.fire({
                title: 'Invalid image url',
                text: 'Please insert a direct link to an image with a valid format (e.g. .jpg, .png, .gif ...)',
                icon: 'warning',
                confirmButtonText: 'Ok'
            })
            return

        }


        const product = {
            brand: brand.value,
            name: name.value,
            price: Number(price.value),
            imageUrl: imageUrl.value,
            description: description.value
        }




        if (mode === "add") {
            Swal.fire({
                title: 'Add confirmation',
                text: 'Are you sure you want to add the current product?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No, I prefer re-check the data',
                reverseButtons: true

            }).then(async (result) => {


                if (result.isConfirmed) {
                    try {
                        Loader.showLoader()
                        await CrudApi.addProduct(product)
                        Loader.hideLoader()


                        Swal.fire({
                            title: 'Add success',
                            text: 'The new product was added successfully!',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        }).then((result) => {

                            Loader.showLoader()
                            if (result.isConfirmed) {


                                Swal.fire({
                                    title: 'Add again confirmation',
                                    text: 'Do you want to add another product?',
                                    icon: 'question',
                                    showCancelButton: true,
                                    confirmButtonText: 'Yes',
                                    cancelButtonText: 'No',
                                    reverseButtons: true

                                }).then((result) => {

                                    Loader.showLoader()

                                    if (result.isConfirmed) {
                                        location.reload()
                                    } else {
                                        window.location.href = "./index.html" //reindirizzamento alla homepage
                                    }
                                    Loader.hideLoader()
                                })
                            }
                        })
                    } catch (error) {

                        Loader.hideLoader()



                        Swal.fire({
                            title: 'Server add error',
                            text: 'An error occurred while trying to add the product: ' + error,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                return
                            }
                        })
                    }
                }
            })
        } else if (mode === "edit") {


            Swal.fire({
                title: 'Update confirmation',
                text: 'Are you sure you want to change the data relating to this product?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No, I prefer re-check the data',
                reverseButtons: true

            }).then(async (result) => {

                if (result.isConfirmed) {
                    try {
                        const productId = id_span.innerText
                        const product = {
                            brand: brand.value,
                            name: name.value,
                            price: Number(price.value),
                            imageUrl: imageUrl.value,
                            description: description.value
                        }

                        Loader.showLoader()
                        await CrudApi.updateProduct(productId, product)
                        Loader.hideLoader()


                        Swal.fire({
                            title: 'Update success!',
                            text: 'Product updated successfully',
                            icon: 'success',
                            confirmButtonText: 'Ok',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Loader.showLoader()
                                window.location.href = "./backoffice.html" //reindirizzamento alla homepage
                                Loader.hideLoader()
                            }
                        })

                    } catch (error) {
                        Loader.hideLoader()


                        Swal.fire({
                            title: 'Server update error',
                            text: 'An error occurred while trying to update the product: ' + error,
                            icon: 'error',
                            confirmButtonText: 'Ok',

                        }).then((result) => {

                            if (result.isConfirmed) {
                                return
                            }
                        })
                    }
                }
            })
        }




    })

}