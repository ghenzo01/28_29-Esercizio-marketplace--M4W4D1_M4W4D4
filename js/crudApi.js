

export class CrudApi {

    //per GET e POST
    static BASE_ENDPOINT = "https://striveschool-api.herokuapp.com/api/product/"

    //per PUT e DELETE
    static ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmNkYmVkZDY5NDA2YTAwMTUwZDk1MGQiLCJpYXQiOjE3MjQ3NTk3NzMsImV4cCI6MTcyNTk2OTM3M30.GM-yUTa-2TynG4U2xcS2fstW-Xchu6BDAsz4tY5d04g"

    static AUTHORIZATION_TOKEN = `Bearer ${this.ACCESS_TOKEN}`
    static CONTENT_TYPE_TOKEN = "application/json"


    static async getProducts() {
        try {
            //simulazione errore
            //throw new Error("problema nel caricamento dei prodotti")
            const response = await fetch(this.BASE_ENDPOINT, {
                headers: {
                    "Authorization": this.AUTHORIZATION_TOKEN

                }
            })

            const data = await response.json()


            console.log("data ===> ", data)

            return data

        } catch (error) {
            //propago l'errore alla pagina che utilizzerà questa classe
            throw error
        }
    }

    static async getProductById(productId) {
        try {
            //simulazione errore
            //throw new Error("problema nel caricamento del prodotto")
            const response = await fetch(this.BASE_ENDPOINT + productId, {
                headers: {
                    "Authorization": this.AUTHORIZATION_TOKEN

                }
            })

            const data = await response.json()

            console.log("data ===> ", data)

            return data

        } catch (error) {
            //propago l'errore alla pagina che utilizzerà questa classe
            throw error
        }
    }

    static async addProduct(product) {
        try {
            //simulazione errore
            //throw new Error("problema nell'aggiunta del prodotto")

            const response = await fetch(this.BASE_ENDPOINT, {
                method: 'POST',
                headers: {
                    "Authorization": this.AUTHORIZATION_TOKEN,
                    "Content-Type": this.CONTENT_TYPE_TOKEN

                },
                body: JSON.stringify(product)
            })

            console.log(response)

        } catch (error) {
            //propago l'errore alla pagina che utilizzerà questa classe
            throw error
        }
    }


    static async deleteProduct(productId) {
        try {
            //simulazione errore
            //throw new Error("problema nell'eliminazione del prodotto")
            const response = await fetch(this.BASE_ENDPOINT + productId, {
                method: 'DELETE',
                headers: {
                    "Authorization": this.AUTHORIZATION_TOKEN,

                },
            })

            console.log(response)

        } catch (error) {
            //propago l'errore alla pagina che utilizzerà questa classe
            throw error
        }
    }


    static async updateProduct(productId, valuesUpdated) {
        try {
            //simulazione errore
            //throw new Error("problema nell'update del prodotto")
            const response = await fetch(this.BASE_ENDPOINT + productId, {
                method: 'PUT',
                headers: {
                    "Authorization": this.AUTHORIZATION_TOKEN,
                    "Content-Type": this.CONTENT_TYPE_TOKEN
                },
                body: JSON.stringify(valuesUpdated)
            })

            console.log(response)
        }
        catch (error) {
            //propago l'errore alla pagina che utilizzerà questa classe
            throw error
        }
    }



}


