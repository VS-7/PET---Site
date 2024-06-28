import React from 'react';
import { Link } from "react-router-dom"; // Importe o componente Link
import { useAuthentication } from "../../hooks/useAuthentication";
import { useAuthValue } from "../../../context/AuthContext";

import styles from "./Settings.module.css"

import { IoIosArrowForward } from "react-icons/io";


const Settings = ( ) => {
    const { user } = useAuthValue();
    const { logout } = useAuthentication();

    return (
        <>
        <div className={styles.settings}>
         <h2> Configurações da conta</h2>
        </div>
        <Link to="/resetPassword" className={styles.password}>Redefinir senha <IoIosArrowForward size="1em" /></Link>
        <div className={styles.button}>{user && (
                    
                    
                    <a onClick={logout} className={styles.logout}>
                        Desconectar {user.displayName} <IoIosArrowForward size="1em" />
                    </a>
                )}</div>
        
                

        </>
    );
}

export default Settings;