import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaFlask, FaHandshake } from "react-icons/fa";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.about}>
      <h2>Sobre o PET - Programa de Educação Tutorial</h2>
      <p>
        O Programa de Educação Tutorial (PET) é uma iniciativa do governo
        federal brasileiro, criada pelo Ministério da Educação (MEC), que visa
        promover a formação acadêmica ampla e integrada de estudantes de graduação.
        O programa é voltado para o aprimoramento do ensino, pesquisa e
        extensão, integrando essas três dimensões de forma interdisciplinar e
        interinstitucional.
      </p>
      <p>
        O PET busca desenvolver atividades que complementem a formação acadêmica
        dos estudantes, proporcionando-lhes experiências que vão além das
        disciplinas curriculares tradicionais. Os grupos PET são constituídos
        por alunos bolsistas e tutores, que orientam as atividades desenvolvidas
        pelo programa.
      </p>
      <div className={styles.icons}>
        <div className={styles.icon}>
          <FaGraduationCap className={styles.iconAnimation} />
          <span>Ensino</span>
        </div>
        <div className={styles.icon}>
          <FaFlask className={styles.iconAnimation} />
          <span>Pesquisa</span>
        </div>
        <div className={styles.icon}>
          <FaHandshake className={styles.iconAnimation} />
          <span>Extensão</span>
        </div>
      </div>
      <Link to="/criar-publicacao" className={styles.btn}>
        Nova publicação
      </Link>
    </div>
  );
};

export default About;
