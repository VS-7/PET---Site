import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from '../PublicationCreate/PublicationPage.module.css';

const TopicView = () => {
  const { courseId, topicId } = useParams();
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) {
        console.error('Invalid topicId');
        return;
      }

      try {
        const docRef = doc(db, `courses/${courseId}/topics`, topicId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTopic(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    };

    fetchTopic();
  }, [courseId, topicId]);

  if (!topic) {
    return <div>Loading...</div>;
  }

  const renderSection = (section) => {
    switch (section.type) {
      case 'title':
        return <h1 className={styles.titulo}>{section.content.title}</h1>;
      case 'text':
        return <p className={styles.paragrafo}>{section.content.text}</p>;
      case 'video':
        return (
          <div className={styles.videoSection}>
            <iframe
              width="560"
              height="315"
              src={section.content.url.replace('watch?v=', 'embed/')}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={section.id}
            ></iframe>
          </div>
        );
      case 'link':
        return (
          <div className={styles.linkSection}>
            <a href={section.content.url} target="_blank" rel="noopener noreferrer">
              {section.content.url}
            </a>
          </div>
        );
      case 'image':
        return (
          <div className={styles.imageSection}>
            <img src={section.content.url} alt="topic" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.publicationPage}>
      {topic.author && <p className={styles.author}>Publicado por {topic.author}</p>}
      {topic.createdAt && (
        <p className={styles.date}>{new Date(topic.createdAt.seconds * 1000).toLocaleDateString()}</p>
      )}
      {topic.sections && topic.sections.map((section) => (
        <div key={section.id} className={styles.section}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};

export default TopicView;
