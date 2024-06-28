import { db } from "../firebase/config";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [cancelled, setCancelled] = useState(false);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    function checkIfIsCancelled() {
        if (cancelled) {
            return;
        }
    }

    // Register
    const createUser = async (data) => {
        checkIfIsCancelled();
        setError(null);
        try {
            setLoading(true);
            const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(user, { displayName: data.displayName });

            // Save user to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                bio: data.bio || '',
                photoURL: user.photoURL || ''
            });

            return user;
        } catch (error) {
            console.log(error.message);
            let systemErrorMessage;
            if (error.message.includes("Password")) {
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }
            setError(systemErrorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login with Google
    const loginWithGoogle = async () => {
        checkIfIsCancelled();
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save user to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                bio: '',
                photoURL: user.photoURL || ''
            }, { merge: true });

            return user;
        } catch (error) {
            console.log(error.message);
            setError("Ocorreu um erro, por favor tente mais tarde.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        checkIfIsCancelled();
        signOut(auth);
    };

    // Login
    const login = async (data) => {
        checkIfIsCancelled();
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);
        } catch (error) {
            let systemErrorMessage;
            if (error.message.includes('user-not-found')) {
                systemErrorMessage = "Usuário não encontrado.";
            } else if (error.message.includes('wrong-password')) {
                systemErrorMessage = "Senha incorreta.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }
            setError(systemErrorMessage);
            setLoading(false);
        }
    };

    // Esqueci minha senha
    const resetPassword = async (email) => {
        const auth = getAuth();
        return sendPasswordResetEmail(auth, email);
    };

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

    return {
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
        resetPassword,
        loginWithGoogle
    };
};
