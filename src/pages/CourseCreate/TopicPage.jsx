import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { db } from '../../firebase/config';
import { collection, addDoc, getDoc, updateDoc, doc } from 'firebase/firestore';
import SectionList from '../PublicationCreate/SectionList';
import styles from '../PublicationCreate/PublicationCreator.module.css';
import { MdOutlineTitle } from "react-icons/md";
import { FaParagraph, FaVideo, FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { useAuthValue } from '../../../context/AuthContext';

const TopicPage = () => {
  const [sections, setSections] = useState([]);
  const [title, setTitle] = useState('');
  const { courseId, topicId } = useParams();
  const { user } = useAuthValue();

  useEffect(() => {
    const fetchTopic = async () => {
      const docRef = doc(db, `courses/${courseId}/topics/${topicId}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const topicData = docSnap.data();
        setTitle(topicData.title);
        setSections(topicData.sections || []);
      }
    };

    fetchTopic();
  }, [courseId, topicId]);

  const addSection = (type) => {
    const newSection = { id: Date.now(), type, content: {} };
    setSections([...sections, newSection]);
  };

  const updateSectionContent = (id, content) => {
    setSections(sections.map(section => section.id === id ? { ...section, content } : section));
  };

  const savePage = async () => {
    try {
      const docRef = doc(db, `courses/${courseId}/topics/${topicId}`);
      await updateDoc(docRef, {
        uid: user.uid,
        title,
        sections,
        updatedAt: new Date()
      });
      alert('Página salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar página: ', error);
      alert('Erro ao salvar página!');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Como será o tópico que você criará?</h2>
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
              placeholder="Escreva seu título..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
        </div>
        <button onClick={savePage} className={styles.saveButton}>
          Salvar Página
        </button>
      </div>
    </DndProvider>
  );
};

export default TopicPage;
