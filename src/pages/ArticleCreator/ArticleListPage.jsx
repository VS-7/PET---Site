import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link } from 'react-router-dom';
import styles from './ArticleListPage.module.css';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articlesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.articleListPage}>
      <h2>Todos os artigos</h2>
      <ul className={styles.articleList}>
        {articles.map((article) => (
          <li key={article.id} className={styles.articleItem}>
            <Link to={`/article/${article.id}`} className={styles.articleLink}>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleAuthor}>Autor: {article.author}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleListPage;
