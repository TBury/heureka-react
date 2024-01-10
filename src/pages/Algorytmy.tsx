import { useEffect, useState } from 'react';
import AlgorytmyComponent from '../components/Algorithms';
import axios from 'axios';

const Algorytmy = () => {
  const [result, setResult] = useState([]);
  const [response, setResponse] = useState('');
  const [error, setError] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/algorithm/')
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteClick = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:8080/api/algorithm/${id}`)
      .then((res) => {
        setResult(result.filter((algortihm) => algortihm.id !== id));
        setShowDeleteModal(false);
      })
      .catch((err) => {
        if (err.response.data.errors !== undefined) {
          const errors = Object.values(err.response.data.errors).flat();
          setError(errors);
        } else {
          setError([err.response.data]);
        }
      });
  };

  const handleEditClick = (id: any, newName: string) =>
    axios
      .patch(`http://localhost:8080/api/algorithm/${id}?newName=${newName}`, {
        id: id,
      })
      .then((res) => {
        const nextResult = [...result];
        const newAlgorithm = nextResult.find((a) => a.id === id);
        if (newAlgorithm) {
          newAlgorithm.name = newName;
        }
        setResult(nextResult);
        setShowEditModal(false);
        setError([]);
      })
      .catch((err) => {
        if (err.response.data.errors !== undefined) {
          const errors = Object.values(err.response.data.errors).flat();
          setError(errors);
        } else {
          setError([err.response.data]);
        }
      });

  const handleAddClick = (name: string, file: File) => {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('algorithmName', name);

    axios
      .postForm(`http://localhost:8080/api/algorithm/`, formData)
      .then((res) => {
        const algorithmDto = {
          id: result.at(-1).id + 1,
          name: name,
          removeable: 1,
        };
        setError([]);
        setResult([...result, algorithmDto]);
        setShowAddModal(false);
      })
      .catch((err) => {
        if (err.response.data.errors !== undefined) {
          const errors = Object.values(err.response.data.errors).flat();
          setError(errors);
        } else {
          setError([err.response.data]);
        }
      });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 mt-2">Algorytmy</h1>
      <div className="flex flex-col gap-10">
        <AlgorytmyComponent
          algorithms={result}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          handleAddClick={handleAddClick}
          response={response}
          error={error}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
        />
      </div>
    </>
  );
};

export default Algorytmy;
