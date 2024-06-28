import { useState, useEffect } from 'react';
import { db } from "../firebase/config";
import { doc, getDoc } from 'firebase/firestore';

export const useUserData = (uid) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (uid) {
            fetchUserData();
        }
    }, [uid]);

    return { userData, loading, error };
};
