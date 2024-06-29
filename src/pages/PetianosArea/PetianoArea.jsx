import React from 'react';
import styles from './PetianoArea.module.css';
import ParticipantList from './ParticipantList';
import { TfiPencilAlt } from "react-icons/tfi";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaCertificate } from "react-icons/fa";
import { AiOutlineFileDone } from "react-icons/ai";

const PetianoArea = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Área do Petiano</h1>
      </header>
      <h3>Opções</h3>
      <section className={styles.options}>
        <button className={styles.optionButton}>
          <div className={styles.button}>
            <TfiPencilAlt size="30px" />
            <span>MINHAS ATIVIDADES</span>
          </div>
        </button>
        <button className={styles.optionButton}>
          <div className={styles.button}>
            <IoDocumentTextOutline size="30px" />
            <span>MEUS RELATÓRIOS</span>
          </div>
        </button>
        <button className={styles.optionButton}>
          <div className={styles.button}>
            <FaCertificate size="30px" />
            <span>MEUS CERTIFICADOS</span>
          </div>
        </button>
        <button className={styles.optionButton}>
          <div className={styles.button}>
            <AiOutlineFileDone size="30px" />
            <span>MEUS TRABALHOS</span>
          </div>
        </button>
      </section>

      <section className={styles.participants}>
        <h3 className={styles.participantsTitle}>Participantes</h3>
        <ParticipantList />
      </section>
    </div>
  );
};

export default PetianoArea;
