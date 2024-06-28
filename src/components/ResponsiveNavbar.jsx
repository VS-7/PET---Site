import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import styles from "./ResponsiveNavbar.module.css";
import SidebarTwo from './SidebarTwo';

const ResponsiveNavbar = () => {
    return (
        <div>
            <div className={styles.navbarContainer}>
                <Navbar />
            </div>
            <div className={styles.sidebarContainer}>
                <Sidebar />
                <SidebarTwo />
            </div>
        </div>
    );
}

export default ResponsiveNavbar;
