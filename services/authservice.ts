import Validator from "./validationservice"
import * as SecureStore from 'expo-secure-store'

export default class Auth{
    #token: string|null
    #user_id: string|number|null

    constructor(){
        //init the token and user_id to null
        this.#token = null
        this.#user_id = null
        // check whether there is a token in secure storage
        SecureStore.getItemAsync('token').then((token) => {
            this.#token = token
        })
        SecureStore.getItemAsync('user_id').then((user_id) => {
            this.#user_id = user_id
        })
    }

    getToken(){
        return  SecureStore.getItem('token')
    }

    getUserId(){
        return this.#user_id
    }

    async setToken(token: string): Promise<boolean>{
        this.#token = token
        return SecureStore.setItemAsync('token', token).then(() => {
            console.log("Token set in secure storage")
            return true
        }).catch((error) => {
            console.log("Error setting token in secure storage: ", error)
            return false
        })
    }

    async getTokenFromSecureStorage(): Promise<string|null>{
        return SecureStore.getItemAsync('token').then((token) => {
            this.#token = token
            return token
        }).catch((error) => {
            console.log("Error getting token from secure storage: ", error)
            return null
        })
    }


    async unsetToken(): Promise<boolean>{
        this.#token = null
        return SecureStore.deleteItemAsync('token').then(() => {
            console.log("Token removed from secure storage")
            return true
        }).catch((error) => {
            console.log("Error removing token from secure storage: ", error)
            return false
        })
    }
}