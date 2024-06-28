import styles from "./ProjectDetail.module.css";

import { Link } from "react-router-dom";

const ProjectDetail = ({ project }) => {

    // Função para truncar a descrição
    const truncate = (str, num) => {
      if (str.length > num) {
        return str.slice(0, num) + "...";
      } else {
        return str;
      }
    };

  return (
    <Link to={`/project/${project.id}`} className={styles.project_detail}>
      <div className={styles.image_container}>
        {project.image && <img src={project.image} alt={project.title} />}
      </div>
      <div className={styles.text_container}>
        <h4>{truncate(project.title, 20)}</h4>
        <p className={styles.createdBy}>@{truncate(project.createdBy, 20)}</p>
        <div className={styles.tags}>
          {project.tagsArray && project.tagsArray.slice(0, 2).map((tag) => (
            <p key={tag}><span>#</span>{tag}</p>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProjectDetail;