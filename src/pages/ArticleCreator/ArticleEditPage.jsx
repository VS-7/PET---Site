import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthValue } from '../../../context/AuthContext';
import styles from './ArticleCreator.module.css';
import { FaTrash } from 'react-icons/fa';
import Modal from '../../components/Authentication/Modal';

const ArticleEditPage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [bibliography, setBibliography] = useState(['']);
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
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
          const data = docSnap.data();
          setArticle({ id: docSnap.id, ...data });
          setTitle(data.title);
          setSummary(data.summary);
          setBibliography(data.bibliography || ['']);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf' && selectedFile.size <= 10 * 1024 * 1024) {
      setFile(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo PDF menor que 10MB');
      setFile(null);
    }
  };

  const handleBibliographyChange = (index, value) => {
    const updatedBibliography = [...bibliography];
    updatedBibliography[index] = value;
    setBibliography(updatedBibliography);
  };

  const addBibliographyField = () => {
    setBibliography([...bibliography, '']);
  };

  const removeBibliographyField = (index) => {
    const updatedBibliography = bibliography.filter((_, i) => i !== index);
    setBibliography(updatedBibliography);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await updateDoc(doc(db, 'articles', articleId), {
        title,
        summary,
        bibliography,
      });

      if (file) {
        const fileRef = ref(storage, `articles/${articleId}/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        await updateDoc(doc(db, 'articles', articleId), { fileURL });
      }

      alert('Artigo atualizado com sucesso!');
      navigate(`/article/${articleId}`);
    } catch (error) {
      console.error('Erro ao atualizar o artigo: ', error);
      alert('Erro ao atualizar o artigo!');
    }

    setUploading(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      alert('Artigo excluído com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir artigo:', error);
      alert('Erro ao excluir artigo!');
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Artigo</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="summary">Resumo:</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label>Referências Bibliográficas:</label>
          {bibliography.map((entry, index) => (
            <div key={index} className={styles.bibliographyEntry}>
              <input
                type="text"
                value={entry}
                onChange={(e) => handleBibliographyChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => removeBibliographyField(index)}
                className={styles.removeButton}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button type="button" onClick={addBibliographyField} className={styles.addButton}>
            Adicionar Bibliografia
          </button>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="file">Enviar PDF (max 10MB):</label>
          <input type="file" id="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={uploading} className={styles.addButton}>
          {uploading ? 'Atualizando...' : 'Atualizar Artigo'}
        </button>
      </form>
      <div className={styles.actions}>
        <button onClick={() => setIsModalOpen(true)} className={styles.buttonRemove}>Excluir Artigo</button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir este artigo?</p>
        <div className={styles.actions}>
          <button onClick={handleDelete} className={styles.buttonRemove}>Confirmar</button>
          <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleEditPage;
