import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './PublicationPage.module.css';

const PublicationPage = () => {
  const { publicationId } = useParams();
  const [publication, setPublication] = useState(null);

  useEffect(() => {
    console.log('publicationId:', publicationId);
    const fetchpublication = async () => {
      if (!publicationId) {
        console.error('Invalid publicationId');
        return;
      }

      try {
        const docRef = doc(db, 'publications', publicationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPublication(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching publication:', error);
      }
    };

    fetchpublication();
  }, [publicationId]);

  if (!publication) {
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
            <img src={section.content.url} alt="publication" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.publicationPage}>
      {publication.author && <p className={styles.author}>Publicado por {publication.author}</p>}
      {publication.createdAt && (
        <p className={styles.date}>{publication.createdAt.toDate().toLocaleDateString()}</p>
      )}
      {publication.sections.map((section) => (
        <div key={section.id} className={styles.section}>
          {renderSection(section)}
        </div>

      ))}
    </div>
  );
};

export default PublicationPage;
