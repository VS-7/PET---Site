import React, { useState } from 'react';
import { useAuthValue } from '../../../context/AuthContext';
import UserPublications from '../../components/DahsboardComponent/UserPublications';
import UserCourses from '../../components/DahsboardComponent/UserCourses';
import UserParticipatedCourses from '../../components/DahsboardComponent/UserParticipatedCourses';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuthValue();
  const [activeComponent, setActiveComponent] = useState('publications');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'publications':
        return <UserPublications userId={user.uid} />;
      case 'courses':
        return <UserCourses userId={user.uid} />;
      case 'participatedCourses':
        return <UserParticipatedCourses userId={user.uid} />;
      default:
        return <UserPublications userId={user.uid} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}></div>
      <div className={styles.profile}>
        <img src={user.photoURL || '/default-profile.png'} alt="profile" className={styles.profileImage} />
        <h2>{user.displayName}</h2>
        <p>{user.email}</p>
      </div>
      <div className={styles.navigation}>
        <button onClick={() => setActiveComponent('publications')}>Publicações</button>
        <button onClick={() => setActiveComponent('courses')}>Cursos</button>
        <button onClick={() => setActiveComponent('participatedCourses')}>Cursos Participados</button>
      </div>
      <div className={styles.content}>
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
