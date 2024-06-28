import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import CourseCard from './CourseCard';
import styles from './PublicationCreator.module.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const courseData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseData);
    };

    fetchCourses();
  }, []);

  return (
    <div className={styles.courses}>
        <h2>Todos os cursos</h2>
    <div className={styles.courseList}>
        
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
    </div>
  );
};

export default CourseList;
