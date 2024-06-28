import styles from "./CreatePost.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useUploadDocument } from "../../hooks/useUploadDocument"; // import the function for uploading images

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // change to null
  const [body, setBody] = useState("");
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState("");
  const [links, setLinks] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("posts");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validate image
    if (!image) {
      setFormError("Por favor, selecione uma imagem.");
      return;
    }

    // Create tags array
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

    const linksArray = links.split(",").map((link) => link.trim());

    // Upload image to Firebase Storage
    try {
      const imageUrl = await useUploadDocument(image, "posts"); // assumindo que "posts" é o caminho no storage
      insertDocument({
        title,
        image: imageUrl,
        body,
        tagsArray,
        linksArray, // Incluído links no documento
        uid: user.uid,
        createdBy: user.displayName,
      });
      navigate("/");
    } catch (error) {
      setFormError("Erro ao fazer upload da imagem. Tente novamente.");
    }
  };


  return (
    <div className={styles.create_post}>
        <h2>Criar Publicação</h2>
        <p>Escreva algo, e compartilhe seu conhecimeto!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Titulo:</span>
            <input 
              type="text" 
              name="title" 
              required 
              placeholder="Pense em um bom título..."
              onChange={(e) => setTitle(e.target.value)} 
              value={title}/>
          </label>
          <label>
            <span>Imagem:</span>
            <input 
              className={styles.fileInput}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          <label>
            <span>Conteúdo:</span>
            <textarea 
              name="body" 
              required 
              placeholder="Insira o conteúdo da publicação"
              onChange={(e) => setBody(e.target.value)}
              value={body}
            ></textarea>
          </label>
          <label>
            <span>Links:</span>
            <input 
              type="text" 
              name="links" 
              placeholder="Insira os links separados por vírgula"
              onChange={(e) => setLinks(e.target.value)} 
              value={links}/>
        </label>
          <label>
            <span>Tags:</span>
            <input 
              type="text" 
              name="tags" 
              required 
              placeholder="Insira as tags separadas por vírgula"
              onChange={(e) => setTags(e.target.value)} 
              value={tags}/>
          </label>
          {!response.loading && <button className="btn">Publicar</button>}
          {response.loading && (
          <button className="btn" disabled>
            Publicando...
          </button>
        )}
        {(response.error || formError) && (
          <p className="error">{response.error || formError}</p>
        )}
        </form>
    </div>
  )
}

export default CreatePost