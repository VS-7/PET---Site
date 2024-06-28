import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import TextSection from './TextSection';
import VideoSection from './VideoSection';
import LinkSection from './LinkSection';
import TitleSection from './TitleSection';
import ImageSection from './ImageSection';
import styles from './PublicationCreator.module.css';
import { FaTrash } from "react-icons/fa";

const DraggableSection = ({ section, index, moveSection, updateSectionContent, removeSection }) => {
  const ref = React.useRef(null);
  const [, drop] = useDrop({
    accept: 'section',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'section',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const renderSectionContent = () => {
    switch (section.type) {
      case 'text':
        return <TextSection section={section} updateContent={updateSectionContent} />;
      case 'video':
        return <VideoSection section={section} updateContent={updateSectionContent} />;
      case 'link':
        return <LinkSection section={section} updateContent={updateSectionContent} />;
      case 'title':
        return <TitleSection section={section} updateContent={updateSectionContent} />;
      case 'image':
        return <ImageSection section={section} updateContent={updateSectionContent} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={styles.draggableSection}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      
      {renderSectionContent()}
      <button onClick={() => removeSection(section.id)} className={styles.removeButton}>
      <FaTrash />
      </button>
    </div>
  );
};

export default DraggableSection;
