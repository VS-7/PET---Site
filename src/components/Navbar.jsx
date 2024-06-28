import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthentication } from '../hooks/useAuthentication';
import { useAuthValue } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import { IoPersonAddOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { FiHome, FiLogIn, FiSearch } from 'react-icons/fi';
import { MdOutlineEmail } from "react-icons/md";
import Modal from './Authentication/Modal';
import Login from './Authentication/Login';
import Register from './Authentication/Register';
import DocumentSearch from './Authentication/DocumentSearch';

const Navbar = () => {
  const { user } = useAuthValue();
  const { logout } = useAuthentication();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className={styles.header}>
        <h4>Plataforma de Estudos, Cursos e Informações</h4>
      </div>
      <div className={styles.navbarContainer}>
        <nav className={styles.navbar}>
          <ul className={styles.links_list}>
            <img src="https://firebasestorage.googleapis.com/v0/b/pet-conex.appspot.com/o/pet-logo.png?alt=media&token=53082fff-dc3b-4408-a167-0986665f4309" alt="logo" className={styles.logo} />
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink to="/sobre" className={({ isActive }) => (isActive ? styles.active : '')}>
                SOBRE
              </NavLink>
            </li>
            <li>
              <NavLink to="/horario-onibus" className={({ isActive }) => (isActive ? styles.active : '')}>
                HORÁRIO DE ÔNIBUS
              </NavLink>
            </li>

            <li>
              {user ? (
                <>
                <ul className={styles.links_list}>
                <li>
                    <NavLink to="/cursos" className={({ isActive }) => (isActive ? styles.active : '')}>
                      CURSOS
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>
                      DASHBOARD
                    </NavLink>
                  </li>
                  <li className={styles.dropdown}>
                    <button onClick={toggleDropdown} className={styles.dropdownButton}>
                      PUBLICAR
                    </button>
                    {isDropdownOpen && (
                      <div className={styles.dropdownContent}>
                        <NavLink to="/criar-publicacao" className={styles.dropdownItem}>
                          Criar uma Publicação
                        </NavLink>
                        <NavLink to="/criar-curso" className={styles.dropdownItem}>
                          Criar um Curso
                        </NavLink>
                      </div>
                    )}
                  </li>
                  </ul>
                </>
              ) : (
                <>
                  {/* Other non-authenticated user links can go here */}
                </>
              )}
            </li>
          </ul>
          <div className={styles.brand}>
            <ul className={styles.links_list}>
              <li>
                <button onClick={() => openModal(<DocumentSearch onClose={closeModal} />)} className={styles.button}>
                  <FiSearch className={styles.icon} />
                </button>
              </li>
              <li>
                {user ? (
                  <button onClick={logout} className={styles.logoutButton}>
                    SAIR
                  </button>
                ) : (
                  <>
                    <button onClick={() => openModal(<Login onClose={closeModal} />)} className={styles.button}>
                      ENTRAR
                    </button>
                    <button onClick={() => openModal(<Register onClose={closeModal} />)} className={styles.register}>
                      <MdOutlineEmail className={styles.icon} />
                      INSCREVER-SE
                    </button>
                  </>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </>
  );
};

export default Navbar;
