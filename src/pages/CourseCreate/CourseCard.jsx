import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase/config';
import { updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { useAuthValue } from '../../../context/AuthContext';
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  const { user } = useAuthValue();
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const courseRef = doc(db, 'courses', course.id);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
          const participants = courseSnap.data().participants || [];
          setIsEnrolled(participants.includes(user.uid));
        }
      } catch (error) {
        console.error('Erro ao verificar status de inscrição: ', error);
      }
    };

    checkEnrollmentStatus();
  }, [course.id, user.uid]);

  const handleEnroll = async () => {
    try {
      const courseRef = doc(db, 'courses', course.id);
      await updateDoc(courseRef, {
        participants: arrayUnion(user.uid)
      });
      alert('Você se inscreveu no curso com sucesso!');
      setIsEnrolled(true); // Atualiza localmente para refletir a inscrição imediata
    } catch (error) {
      console.error('Erro ao se inscrever no curso: ', error);
      alert('Erro ao se inscrever no curso!');
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className={styles.courseCard}>
      {course.image && <img src={course.image} alt={course.title} className={styles.courseImage} />}
      <h2>{truncateText(course.title, 50)}</h2> {/* Limite o título a 50 caracteres */}
      <p>{truncateText(course.description, 100)}</p> {/* Limite a descrição a 100 caracteres */}
      <div className={styles.buttons}>
        <Link to={`/cursos/${course.id}`}>Ver Curso</Link>
        <button onClick={handleEnroll} className={styles.button} disabled={isEnrolled}>
          {isEnrolled ? 'Inscrito' : 'Inscrever-se'}
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
