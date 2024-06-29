// UserParticipatedCourses.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import styles from './DashboardComponent.module.css';

const UserParticipatedCourses = ({ userId }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchParticipatedCourses = async () => {
      const q = query(collection(db, 'courses'), where('participants', 'array-contains', userId));
      const querySnapshot = await getDocs(q);
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    };

    fetchParticipatedCourses();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h3>Cursos que Participa</h3>
      {courses.map(course => (
        <div key={course.id} className={styles.course}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>
          <a href={`/cursos/${course.id}`}>Abir curso</a>
        </div>
      ))}
    </div>
  );
};

export default UserParticipatedCourses;
