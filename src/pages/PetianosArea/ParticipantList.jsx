import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthValue } from '../../../context/AuthContext';
import styles from './ParticipantList.module.css';

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const { user } = useAuthValue();

  useEffect(() => {
    const fetchParticipants = async () => {
      const db = getFirestore();
      const q = query(collection(db, 'users'), where('role', '==', 'petiano'));
      const querySnapshot = await getDocs(q);
      const participantsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setParticipants(participantsList);
    };

    fetchParticipants();
  }, [user]);

  return (
    <div className={styles.participantsContainer}>
      {participants.length > 0 ? (
        participants.map((participant) => (
          <div key={participant.id} className={styles.participantCard}>
            <div className={styles.participantInfo}>
              <span>{participant.displayName}</span>
              <span>{participant.role}</span>
            </div>
            <button className={styles.viewWorkButton}>Visualizar trabalhos</button>
          </div>
        ))
      ) : (
        <p>Nenhum participante encontrado.</p>
      )}
    </div>
  );
};

export default ParticipantList;
