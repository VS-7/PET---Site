import styles from "./CreateProject.module.css"; // Ajuste o caminho conforme necessário
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";
import { useUploadDocument } from "../../hooks/useUploadDocument"; // Importe a função para upload de imagens

const CreateProject = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null); // Alterado para null
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [maxParticipants, setMaxParticipants] = useState(""); // Novo estado para o limite de participantes
  const [formError, setFormError] = useState("");
  const [link, setLink] = useState("");

  const { user } = useAuthValue();
  const { insertDocument, response } = useInsertDocument("projects"); // Alterado para "projects"
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validar imagem
    if (!image) {
      setFormError("Por favor, selecione uma imagem.");
      return;
    }

    // Criar array de tags
    const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());

     // Criar array de links


    // Upload da imagem para o Firebase Storage
    try {
      // Adicionando linksArray ao objeto inserido
      const imageUrl = await useUploadDocument(image, "projects");
      insertDocument({
        title,
        image: imageUrl,
        description,
        tagsArray,
        link, // Adicionado links ao documento
        maxParticipants: Number(maxParticipants),
        uid: user.uid,
        createdBy: user.displayName,
        currentParticipants: 1
      });
      navigate("/");
    } catch (error) {
      setFormError("Erro ao fazer upload da imagem. Tente novamente.");
    }
  };


  return (
    <div className={styles.create_project}>
        <h2>Criar Projeto</h2>
        <p>Descreva o projeto e convide outros à participarem!</p>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Título:</span>
            <input 
              type="text" 
              name="title" 
              required 
              placeholder="Um bom título para o projeto..."
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
            <span>Descrição:</span>
            <textarea 
              name="description" 
              required 
              placeholder="Descreva o projeto"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            ></textarea>
          </label>
          <label>
            <span>Limite de Participantes:</span>
            <input 
              type="number" 
              name="maxParticipants" 
              required 
              placeholder="Número máximo de participantes"
              onChange={(e) => setMaxParticipants(e.target.value)} 
              value={maxParticipants}/>
          </label>
          <label>
            <span className={styles.optionalText}>(opcional)</span>
            <span>Link:</span>
            <input 
              type="text" 
              name="link" 
              placeholder="Insira o link do projeto"
              onChange={(e) => setLink(e.target.value)} 
              value={link}/>
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

export default CreateProject;