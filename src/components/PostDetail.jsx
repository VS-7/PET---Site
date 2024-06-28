import styles from "./PostDetail.module.css";
import { Link } from "react-router-dom";

const PostDetail = ({ post }) => {
  // Função para truncar a descrição
  const truncate = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  return (
    <div className={styles.post_form}>
      <div className={styles.post_datail}>
        <Link to={`/posts/${post.id}`}>
          {post.image && <img src={post.image} alt={post.title} />}
        </Link>
        <h2>{post.title}</h2>
        <p className={styles.createdBy}>{post.createdBy}</p>
        {/* Adicionando a descrição truncada */}
        <p className={styles.body}>{truncate(post.body, 40)}</p>
        <div className={styles.tags}>
          {post.tagsArray.map((tag) => (
            <p key={tag}>
             <span>#</span>{tag}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;