import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import SectionList from './SectionList';
import styles from './PublicationCreator.module.css';
import { MdOutlineTitle } from "react-icons/md";
import { FaParagraph, FaVideo, FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { useAuthValue } from '../../../context/AuthContext';

const PublicationCreator = () => {
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuthValue();


  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: {} };
    setSections([...sections, newSection]);
  };

  const updateSectionContent = (id, content) => {
    setSections(sections.map(section => section.id === id ? { ...section, content } : section));
  };

  const saveCourse = async () => {
    try {
      await addDoc(collection(db, 'publications'), {
        uid: user.uid,
        title,
        description,
        sections,
        createdAt: new Date(),
        author: user.displayName 
      });
      alert('Course saved successfully!');
    } catch (error) {
      console.error('Error saving course: ', error);
      alert('Error saving course!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>O que você vai publicar hoje?</h2>
          <div className={styles.toolbar}>
           <div className={styles.toolbarButton}>
                <button onClick={() => addSection('title')}><MdOutlineTitle size="30px"/></button>
                <label >Adicionar Título</label>
            </div>
            <div className={styles.toolbarButton}>
                <button onClick={() => addSection('text')}><FaParagraph size="30px"/></button>
                <label >Adicionar Parágrafo</label>
            </div>
            <div className={styles.toolbarButton}>
                <button onClick={() => addSection('image')}><FaRegImage size="30px"/></button>
                <label >Adicionar Imagem</label>
            </div>
            <div className={styles.toolbarButton}>
                <button onClick={() => addSection('video')}><FaVideo size="30px"/></button>
                <label >Adicionar Vídeo</label>
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
        <button onClick={saveCourse} className={styles.saveButton}>
          Salvar Publicação
        </button>
      </div>
    </DndProvider>
  );
};

export default PublicationCreator;
