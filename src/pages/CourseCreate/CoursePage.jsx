import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config'; // Adicionar 'storage' aqui
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importar funções do storage
import { useAuthValue } from '../../../context/AuthContext';
import Modal from '../../components/Authentication/Modal';
import styles from './CoursePage.module.css';
import { FaFolder } from "react-icons/fa6";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseImage, setCourseImage] = useState(null); // Novo estado para imagem de capa
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const { user } = useAuthValue();

  useEffect(() => {
    fetchCourses();
  }, [user.uid]);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const coursesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const userCourses = coursesData.filter(course => course.uid === user.uid);
      setCourses(userCourses);
    } catch (error) {
      console.error('Erro ao buscar cursos: ', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setCourseImage(e.target.files[0]);
    }
  };

  const addCourse = async () => {
    try {
      let imageURL = '';
      if (courseImage) {
        const imageRef = ref(storage, `courseImages/${courseImage.name}`);
        await uploadBytes(imageRef, courseImage);
        imageURL = await getDownloadURL(imageRef);
      }

      let newCourse = null;
      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), {
          title: courseTitle,
          description: courseDescription,
          image: imageURL || editingCourse.image // Manter a imagem anterior se não for alterada
        });
        newCourse = { ...editingCourse, title: courseTitle, description: courseDescription, image: imageURL || editingCourse.image };
        setEditingCourse(null);
      } else {
        const docRef = await addDoc(collection(db, 'courses'), {
          uid: user.uid,
          title: courseTitle,
          description: courseDescription,
          image: imageURL,
          createdAt: new Date(),
          author: user.displayName,
          participants: []
        });
        newCourse = {
          id: docRef.id,
          uid: user.uid,
          title: courseTitle,
          description: courseDescription,
          image: imageURL,
          createdAt: new Date(),
          author: user.displayName,
          participants: []
        };
      }
      setCourses([...courses, newCourse]);
      setCourseTitle('');
      setCourseDescription('');
      setCourseImage(null);
      alert('Curso salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar curso: ', error);
      alert('Erro ao salvar curso!');
    }
  };

  const editCourse = (course) => {
    setEditingCourse(course);
    setCourseTitle(course.title);
    setCourseDescription(course.description);
    setCourseImage(null); // Limpar a imagem atual ao editar
  };

  const confirmDeleteCourse = (course) => {
    setCourseToDelete(course);
    setIsModalOpen(true);
  };

  const deleteCourse = async () => {
    try {
      await deleteDoc(doc(db, 'courses', courseToDelete.id));
      setCourses(courses.filter(course => course.id !== courseToDelete.id));
      setIsModalOpen(false);
      setCourseToDelete(null);
      alert('Curso excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir curso: ', error);
      alert('Erro ao excluir curso!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Criar Curso</h1>
        <div className={styles.courseForm}>
          <input
            type="text"
            placeholder="Título do curso"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
          <textarea
            placeholder="Descrição do curso"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
          />
           <label for="arquivo"><FaFolder />Enviar imagem de capa</label>
          <input
            type="file"
            name="arquivo"
            id="arquivo"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button onClick={addCourse}>{editingCourse ? 'Salvar Alterações' : 'Criar Curso'}</button>
        </div>
      </div>
      <div className={styles.courseList}>
        <h3>Seus Cursos</h3>
        {courses.map(course => (
          <div key={course.id} className={styles.courseItem}>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <a href={`/cursos/lista/${course.id}`}>Ver Tópicos</a>
            <button onClick={() => editCourse(course)} className={styles.buttons}>Editar</button>
            <button onClick={() => confirmDeleteCourse(course)} className={styles.buttonRemove}>Excluir</button>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Confirmação de Exclusão</h2>
        <p>Tem certeza de que deseja excluir o curso "{courseToDelete?.title}"?</p>
        <button onClick={deleteCourse} className={styles.buttons}>Confirmar</button>
        <button onClick={() => setIsModalOpen(false)} className={styles.buttons}>Cancelar</button>
      </Modal>
    </div>
  );
};

export default CoursePage;
