import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './ArticlePage.module.css';
import { useAuthValue } from '../../../context/AuthContext';
import Modal from '../../components/Authentication/Modal';
import { GrDocumentPdf } from "react-icons/gr";

const ArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthValue();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        console.error('Invalid articleId');
        return;
      }

      try {
        const docRef = doc(db, 'articles', articleId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Erro ao buscar o artigo', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => {
    navigate(`/editar-artigo/${articleId}`, { state: { article } });
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      alert('Artigo deletado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar o artigo:', error);
      alert('Erro ao deletar o artigo!');
    }
  };

  return (
    <div className={styles.articlePage}>
      {article.author && <p className={styles.author}>Publicado por {article.author}</p>}
      {article.createdAt && (
        <p className={styles.date}>{article.createdAt.toDate().toLocaleDateString()}</p>
      )}
      <div className={styles.pdfView}>
       {article.fileURL && (
        <div className={styles.fileSection}>
          <a href={article.fileURL} target="_blank" rel="noopener noreferrer">
          <GrDocumentPdf size="80px"/> <p>Ver PDF</p>
          </a>
        </div>
      )}
      <h1 className={styles.title}>{article.title}</h1>
      </div>
      <hr />
      <h3>Resumo</h3>
      <p className={styles.summary}>{article.summary}</p>
      <hr />
      {article.bibliography && article.bibliography.length > 0 && (
        <div className={styles.bibliography}>
          <h3>Referências Bibliográficas</h3>
          <ul>
            {article.bibliography.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))}
          </ul>
        </div>
      )}
      {user.uid === article.uid && (
        <div className={styles.actions}>
          <button onClick={handleEdit} className={styles.buttons}>Edit</button>
          <button onClick={() => setIsModalOpen(true)} className={styles.buttonRemove}>Delete</button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir o artigo?</p>
        <div className={styles.actions}>
          <button onClick={handleDelete} className={styles.buttonRemove}>Confirm</button>
          <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default ArticlePage;
