import { db } from '../firebase/config'; // Ajuste o caminho de importação conforme sua configuração
import { doc, updateDoc } from 'firebase/firestore';

const updateUserProfile = async (userId, profileData) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, profileData);
};