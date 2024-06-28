import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Post from '../../pages/Post/Post';
import styles from './DashboardComponent.module.css';

const UserPublications = ({ userId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const q = query(collection(db, 'publications'), where('uid', '==', userId));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    fetchUserPosts();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h3>Publicações</h3>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default UserPublications;
