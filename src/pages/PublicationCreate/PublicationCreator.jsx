import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { db } from '../../firebase/config';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import SectionList from './SectionList';
import styles from './PublicationCreator.module.css';
import { MdOutlineTitle } from "react-icons/md";
import { FaParagraph, FaVideo, FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { useAuthValue } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PublicationCreator = ({ publication }) => {
  const [sections, setSections] = useState(publication ? publication.sections : []);
  const [title, setTitle] = useState(publication ? publication.title : '');
  const [description, setDescription] = useState(publication ? publication.description : '');
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: {} };
    setSections([...sections, newSection]);
  };

  const updateSectionContent = (id, content) => {
    setSections(sections.map(section => section.id === id ? { ...section, content } : section));
  };

  const savePublication = async () => {
    try {
      if (publication) {
        const docRef = doc(db, 'publications', publication.id);
        await updateDoc(docRef, {
          title,
          description,
          sections,
          // Não atualizar createdAt
        });
        alert('Publicação atualizada com sucesso!');
        navigate('/')
      } else {
        await addDoc(collection(db, 'publications'), {
          uid: user.uid,
          title,
          description,
          sections,
          createdAt: new Date(),
          author: user.displayName
        });
        alert('Publicação criada com sucesso!');
        navigate('/')
      }
    } catch (error) {
      console.error('Erro ao salvar a publicação: ', error);
      alert('Erro ao salvar a publicação!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>{publication ? 'Editar Publicação' : 'O que você vai publicar hoje?'}</h2>
          <div className={styles.toolbar}>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('title')}><MdOutlineTitle size="30px"/></button>
              <label>Adicionar Título</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('text')}><FaParagraph size="30px"/></button>
              <label>Adicionar Parágrafo</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('image')}><FaRegImage size="30px"/></button>
              <label>Adicionar Imagem</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('video')}><FaVideo size="30px"/></button>
              <label>Adicionar Vídeo</label>
            </div>
            <div className={styles.toolbarButton}>
              <button onClick={() => addSection('link')}><FaLink size="30px"/></button>
              <label>Adicionar Link</label>
            </div>
          </div>
        </div>
        <div className={styles.editor}>
          <div className={styles.leftColumn}>
            <h3>Sua publicação</h3>
            <SectionList sections={sections} setSections={setSections} updateSectionContent={updateSectionContent} />
          </div>
          <div className={styles.rightColumn}>
            <h3>Título</h3>
            <input 
              type="text" 
              placeholder="Escreva o título da sua publicação..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <h3>Descrição</h3>
            <textarea 
              placeholder="Escreva a descrição para sua publicação..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
        </div>
        <button onClick={savePublication} className={styles.saveButton}>
          {publication ? 'Atualizar Publicação' : 'Salvar Publicação'}
        </button>
      </div>
    </DndProvider>
  );
};

export default PublicationCreator;
