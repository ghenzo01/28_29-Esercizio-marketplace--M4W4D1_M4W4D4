
import { CrudApi } from "./crudApi.js"
import { Loader } from "./loader.js"


window.onload = async () => {

    //utilizzo di URLSearchParams
    const urlParams = new URLSearchParams(window.location.search)
    const targetId = urlParams.get('id')
    try {
        Loader.showLoader()
        const targetProduct = await CrudApi.getProductById(targetId)
        Loader.hideLoader()


        if (targetProduct) {
            const { name, brand, description, price, imageUrl } = targetProduct

            //assegnazione ai vari elementi del DOM
            document.getElementById('product-name').textContent = name
            document.getElementById('product-brand').textContent = brand
            document.getElementById('product-description').textContent = description
            document.getElementById('product-id').textContent = targetId
            document.getElementById('product-price').textContent = `${price} €`
            document.getElementById('product-img').src = imageUrl
        } else {
            Swal.fire({
                title: 'Product not found',
                text: 'The product selected no longer exists',
                icon: 'warning',
                confirmButtonText: 'Ok',

            }).then(() => { return })

        }
    } catch (error) {
        Loader.hideLoader()
        Swal.fire({
            title: 'Server get error',
            text: `An error occurred while trying to retrieve the product with id ${targetId}: ` + error,
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











