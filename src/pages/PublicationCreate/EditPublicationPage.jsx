import React from 'react';
import { useLocation } from 'react-router-dom';
import PublicationCreator from './PublicationCreator';

const EditPublicationPage = () => {
  const location = useLocation();
  const { publication } = location.state;

  return <PublicationCreator publication={publication} />;
};

export default EditPublicationPage;
