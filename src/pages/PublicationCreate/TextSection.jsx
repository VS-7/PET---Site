import React, { useState, useEffect } from 'react';
import styles from './PublicationCreator.module.css';

const TextSection = ({ section, updateContent }) => {
  const [content, setContent] = useState(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  const handleChange = (e) => {
    const newContent = { ...content, text: e.target.value };
    setContent(newContent);
    updateContent(section.id, newContent);
  };

  return (
    <div className={styles.textSection}>
      <textarea
        value={content.text || ''}
        onChange={handleChange}
        placeholder="Adicione um texto para um tópico ou curso..."
      />
    </div>
  );
};

export default TextSection;
