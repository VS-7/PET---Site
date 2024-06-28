import React from 'react';
import DraggableSection from './DraggableSection';
import styles from './PublicationCreator.module.css';

const SectionList = ({ sections, setSections, updateSectionContent }) => {
  const moveSection = (dragIndex, hoverIndex) => {
    const dragSection = sections[dragIndex];
    const newSections = [...sections];
    newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, dragSection);
    setSections(newSections);
  };

  const removeSection = (id) => {
    setSections(sections.filter(section => section.id !== id));
  };

  return (
    <div className={styles.sectionList}>
      {sections.map((section, index) => (
        <DraggableSection 
          key={section.id} 
          section={section} 
          index={index} 
          moveSection={moveSection}
          updateSectionContent={updateSectionContent}
          removeSection={removeSection}
        />
      ))}
    </div>
  );
};

export default SectionList;
