import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Post.module.css';

const Post = ({ post }) => {
  const navigate = useNavigate();
  const { id, title, description, author, createdAt } = post;
  const firstParagraph = description.split('\n')[0];
  const limitedDescription = firstParagraph.split(' ').slice(0, 50).join(' ') + '...';

  const handleClick = () => {
    navigate(`/publicacao/${id}`);
  };

  return (
    <div className={styles.post} onClick={handleClick}>
      <p className={styles.date}>MAIS RECENTE -- {createdAt.toDate().toLocaleDateString()}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{limitedDescription}</p>
      <p className={styles.author}>Publicado por {author}</p>
    </div>
  );
};

export default Post;
