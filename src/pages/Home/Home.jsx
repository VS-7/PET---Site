import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Post from '../Post/Post';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'publications'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar por data de criação, mais recente primeiro
      postsData.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  const handleClick = (id) => {
    navigate(`/publicacao/${id}`);
  };

  const mostRecentPost = posts[0];
  const olderPosts = posts.slice(1);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.posts}>
          {mostRecentPost && (
            <>
              <div className={styles.recentPost}>
                <Post post={mostRecentPost} />
              </div>
              <div className={styles.moreEditions}>
                <div className={styles.maisEdicoes}>
                    <h5>MAIS EDIÇÕES</h5> <hr />
                </div>
                
                {olderPosts.map(post => (
                  <div 
                    key={post.id} 
                    className={styles.editionPost} 
                    onClick={() => handleClick(post.id)}
                  >
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <p className={styles.date}>
                      {post.createdAt.toDate().toLocaleDateString()} Publicado por {post.author}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
        <aside className={styles.sidebar}>
          <div className={styles.about}>
          <div className={styles.maisEdicoes}>
                    <h5>SOBRE</h5> <hr />
                </div>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/pet-conex.appspot.com/o/pet-logo.png?alt=media&token=53082fff-dc3b-4408-a167-0986665f4309" 
              alt="logo" 
              className={styles.logo} 
            />
            <p>Conexão de Saberes é um material de distribuição gratuita...</p>
          </div>
          <div className={styles.topics}>
          <div className={styles.maisEdicoes}>
                    <h5>TÓPICOS</h5> <hr />
                </div>
            <ul>
              <li>Cases (2 edições)</li>
              <li>Desenvolvimento (10 edições)</li>
              <li>Ideação (6 edições)</li>
              <li>Lançamento (4 edições)</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Home;
