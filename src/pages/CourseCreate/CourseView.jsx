import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import styles from './CoursePage.module.css';

const CourseView = () => {
  const { courseId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const querySnapshot = await getDocs(collection(db, `courses/${courseId}/topics`));
      const topicsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTopics(topicsData);
    };

    fetchTopics();
  }, [courseId]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tópicos</h1>
      </div>
      <div className={styles.courseList}>
        {topics.map(topic => (
          <div key={topic.id} className={styles.courseItem}>
            <h2>{topic.title}</h2>
            <Link to={`/cursos/${courseId}/topico/${topic.id}`}>Ver Página</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseView;
