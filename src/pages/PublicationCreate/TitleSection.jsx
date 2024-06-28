import React, { useState, useEffect } from 'react';
import styles from './PublicationCreator.module.css';

const TitleSection = ({ section, updateContent }) => {
  const [content, setContent] = useState(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  const handleChange = (e) => {
    const newContent = { ...content, title: e.target.value };
    setContent(newContent);
    updateContent(section.id, newContent);
  };

  return (
    <div className={styles.titleSection}>
      <input
        type="text"
        value={content.title || ''}
        onChange={handleChange}
        placeholder="Adicione um titulo para um tópico ou curso..."
      />
    </div>
  );
};

export default TitleSection;
