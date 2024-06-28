import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Ajuste o caminho conforme necessário

export const useFetchInterestRequests = (projectIds) => {
  const [interestRequests, setInterestRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterestRequests = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "projectInterests"), where("projectId", "in", projectIds.length > 0 ? projectIds : ["dummy"]));
        const querySnapshot = await getDocs(q);
        const interests = [];
        querySnapshot.forEach((doc) => {
          interests.push({ id: doc.id, ...doc.data() });
        });
        setInterestRequests(interests);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (projectIds && projectIds.length > 0) {
      fetchInterestRequests();
    } else {
      setLoading(false);
    }
  }, [projectIds]);

  return { interestRequests, loading, error };
};
