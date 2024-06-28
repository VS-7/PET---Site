import React, { useState } from 'react';
import { useFetchDocuments } from '../../hooks/useFetchDocuments';
import styles from './Modal.module.css';

const DocumentSearch = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { documents, loading, error } = useFetchDocuments('publications', searchTerm);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Busque pelo título ou descrição..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {error && <p>{error}</p>}
      {documents && (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <h3>{doc.title}</h3>
              <p>{doc.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentSearch;
