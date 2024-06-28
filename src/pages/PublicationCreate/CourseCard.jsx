import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CourseCard.module.css';

const CourseCard = ({ course }) => {
  return (
    <div className={styles.courseCard}>
      {course.image && <img src={course.image} alt={course.title} className={styles.courseImage} />}
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <Link to={`/cursos/${course.id}`}>Ver Curso</Link>
    </div>
  );
};

export default CourseCard;
