import React from "react"
import {addDoc} from "firebase/firestore"



export const useAddTransaction =   ()=>{
    
    const addTransaction = async ()=>{
        await addDoc()
    }
    return 
}