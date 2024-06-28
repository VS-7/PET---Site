import { useState, useEffect, useReducer } from "react"
import { db } from "../firebase/config"
import { collection, addDoc, Timestamp } from "firebase/firestore"

const initialState = {
    loading: null,
    error: null
}

const insertReducer = (state, action) => {
    switch(action.type) {
        
        case "LOADING":
            return {loading: true, error: null}
        case "INSERTED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}

export const useInsertDocument = (docCollection) => {
    const [response, dispatch] = useReducer(insertReducer, initialState)

    // deal witch memory leak
    const [cancelled, setCancelled] = useState(false)

    const checkCancelBeforeDispacth = (action) => {
        if(!cancelled) {
            return
        } else {
            dispatch(action)
        }
    }

    const insertDocument = async (document) => {
        checkCancelBeforeDispacth({
            type: "LOADING"
        })
        try {
            const newDocument = {...document, createdAt: Timestamp.now()}
            const insertedDocument = await addDoc(
                collection(db, docCollection),
                newDocument
            )

            checkCancelBeforeDispacth({
                type: "INSERTED_DOC",
                payload: insertedDocument
            })
        } catch (error) {
            checkCancelBeforeDispacth({
                type: "ERROR",
                payload: error.message,
            })
            
        }
    }

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return { insertDocument, response }
}
