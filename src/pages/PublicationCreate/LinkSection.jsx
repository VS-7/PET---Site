import React, { useState, useEffect } from 'react';
import styles from './PublicationCreator.module.css';

const LinkSection = ({ section, updateContent }) => {
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
    <div className={styles.linkSection}>
      <input
        type="text"
        value={content.url || ''}
        onChange={handleChange}
        placeholder="Adicione um link..."
      />
    </div>
  );
};

export default LinkSection;
