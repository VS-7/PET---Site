import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../components/Authentication/Modal';
import styles from './CoursePage.module.css';

const TopicList = () => {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);
  const [topicTitle, setTopicTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      const querySnapshot = await getDocs(collection(db, `courses/${courseId}/topics`));
      const topicsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTopics(topicsData);
    };

    fetchTopics();
  }, [courseId]);

  const addTopic = async () => {
    try {
      await addDoc(collection(db, `courses/${courseId}/topics`), {
        title: topicTitle,
        createdAt: new Date()
      });
      setTopicTitle('');
      // Atualize a lista de tópicos após adicionar um novo
      const querySnapshot = await getDocs(collection(db, `courses/${courseId}/topics`));
      const topicsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTopics(topicsData);
      alert('Tópico criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar tópico: ', error);
      alert('Erro ao criar tópico!');
    }
  };

  const confirmDeleteTopic = (topic) => {
    setTopicToDelete(topic);
    setIsModalOpen(true);
  };

  const deleteTopic = async () => {
    try {
      await deleteDoc(doc(db, `courses/${courseId}/topics`, topicToDelete.id));
      setTopics(topics.filter(topic => topic.id !== topicToDelete.id));
      setIsModalOpen(false);
      setTopicToDelete(null);
      alert('Tópico excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir tópico: ', error);
      alert('Erro ao excluir tópico!');
    }
  };

  const editTopic = (topicId) => {
    navigate(`/cursos/${courseId}/topicos/${topicId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tópicos</h1>
        <div className={styles.courseForm}>
          <input
            type="text"
            placeholder="Título do tópico"
            value={topicTitle}
            onChange={(e) => setTopicTitle(e.target.value)}
          />
          <button onClick={addTopic}>Criar Tópico</button>
        </div>
      </div>
      <div className={styles.courseList}>
        {topics.map(topic => (
          <div key={topic.id} className={styles.courseItem}>
            <h2>{topic.title}</h2>
            <a href={`/cursos/${courseId}/topico/${topic.id}`}>Ver Páginas</a>
            <button onClick={() => editTopic(topic.id)} className={styles.buttons}>Editar</button>
            <button onClick={() => confirmDeleteTopic(topic)} className={styles.buttonRemove}>Excluir</button>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir o tópico "{topicToDelete?.title}"?</p>
        <button onClick={deleteTopic} className={styles.buttons}>Confirmar</button>
        <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancelar</button>
      </Modal>
    </div>
  );
};

export default TopicList;
