import React, { useState } from 'react';
import { db, storage } from '../../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthValue } from '../../../context/AuthContext';
import styles from './ArticleCreator.module.css';
import { FaTrash } from 'react-icons/fa';

const ArticleCreator = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [bibliography, setBibliography] = useState(['']);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthValue();

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
      const docRef = await addDoc(collection(db, 'articles'), {
        uid: user.uid,
        title,
        summary,
        bibliography,
        createdAt: new Date(),
        author: user.displayName,
      });

      if (file) {
        const fileRef = ref(storage, `articles/${docRef.id}/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        await updateDoc(doc(db, 'articles', docRef.id), { fileURL });
      }

      alert('Artigo publicado com sucesso!');
      setTitle('');
      setSummary('');
      setBibliography(['']);
      setFile(null);
    } catch (error) {
      console.error('Erro ao publicar o artigo: ', error);
      alert('Erro ao publicar o artigo!');
    }

    setUploading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Publicar Artigo</h1>
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
          {uploading ? 'Enviando...' : 'Publicar Artigo'}
        </button>
      </form>
    </div>
  );
};

export default ArticleCreator;
