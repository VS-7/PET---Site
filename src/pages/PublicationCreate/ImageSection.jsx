import React, { useState, useEffect } from 'react';
import styles from './PublicationCreator.module.css';

const ImageSection = ({ section, updateContent }) => {
  const [content, setContent] = useState(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  const handleChange = (e) => {
    const newContent = { ...content, url: e.target.value };
    setContent(newContent);
    updateContent(section.id, newContent);
  };

  return (
    <div className={styles.imageSection}>
      <input
        type="text"
        value={content.url || ''}
        onChange={handleChange}
        placeholder="Adicione a URL de uma imagem..."
      />
      {content.url && <img src={content.url} alt="Course" />}
    </div>
  );
};

export default ImageSection;
