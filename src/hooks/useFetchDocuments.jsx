import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useFetchDocuments = (collectionName, searchTerm) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let qTitle = query(collection(db, collectionName));
        let qDescription = query(collection(db, collectionName));

        if (searchTerm) {
          qTitle = query(
            collection(db, collectionName),
            where('title', '>=', searchTerm),
            where('title', '<=', searchTerm + '\uf8ff')
          );

          qDescription = query(
            collection(db, collectionName),
            where('description', '>=', searchTerm),
            where('description', '<=', searchTerm + '\uf8ff')
          );
        }

        const querySnapshotTitle = await getDocs(qTitle);
        const querySnapshotDescription = await getDocs(qDescription);

        const dataTitle = querySnapshotTitle.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const dataDescription = querySnapshotDescription.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Combining and removing duplicates
        const combinedData = [...dataTitle, ...dataDescription];
        const uniqueData = combinedData.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setDocuments(uniqueData);
      } catch (err) {
        setError('Ocorreu um erro ao buscar os documentos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, searchTerm]);

  return { documents, loading, error };
};
