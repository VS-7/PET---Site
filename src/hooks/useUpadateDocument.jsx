import { useState, useEffect, useReducer } from "react"
import { db } from "../firebase/config"
import { updateDoc, doc } from "firebase/firestore"

const initialState = {
    loading: null,
    error: null
}

const updateReducer = (state, action) => {
    switch(action.type) {
        
        case "LOADING":
            return {loading: true, error: null}
        case "UPDATED_DOC":
            return {loading: false, error: null}
        case "ERROR":
            return {loading: false, error: action.payload}
        default:
            return state;
    }
}

export const useUpdateDocument = (docCollection) => {
    const [response, dispatch] = useReducer(updateReducer, initialState)

    // deal witch memory leak
    const [cancelled, setCancelled] = useState(false)

    const checkCancelBeforeDispacth = (action) => {
        if(!cancelled) {
            return
        } else {
            dispatch(action)
        }
    }

    const updateDocument = async (id, data) => {
        checkCancelBeforeDispacth({
            type: "LOADING"
        })
        try {

            const docRef = await doc(db,docCollection, id);
            const updatedDocument = await updateDoc(docRef, data);

            checkCancelBeforeDispacth({
                type: "UPDATED_DOC",
                payload: updatedDocument
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

    return { updateDocument, response }
}
