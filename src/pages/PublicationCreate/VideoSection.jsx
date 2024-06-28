import React, { useState, useEffect } from 'react';
import styles from './PublicationCreator.module.css';

const VideoSection = ({ section, updateContent }) => {
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
    <div className={styles.videoSection}>
      <input
        type="text"
        value={content.url || ''}
        onChange={handleChange}
        placeholder="Adicione uma URL para adicionar um vídeo do YouTube..."
      />
    </div>
  );
};

export default VideoSection;
