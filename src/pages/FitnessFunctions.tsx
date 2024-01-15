import { useEffect, useState } from 'react';
import FitnessComponent from '../components/Fitness';
import axios from 'axios';

const Fitness = () => {
  const [result, setResult] = useState([]);
  const [response, setResponse] = useState('');
  const [fileName, setFileName] = useState('');
  const [dimension, setDimension] = useState(0);
  const [error, setError] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleFormChange = (event, index) => {
    if (event != 'reset') {
      let data = [...formFields];
      data[index][parseInt(event.target.name)] = parseFloat(
        event.target.value,
      );
      setFormFields(data);
    } else {
      setFormFields([]);
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/fitnessFunction/')
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
      });
  }, [formFields]);

  function handleDeleteClick(id: number) {
    axios
      .delete(`http://localhost:8080/api/fitnessFunction/${id}`)
      .then((res) => {
        setResult(
          result.filter((fitnessFunction) => fitnessFunction.id !== id),
        );
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleEditClick(id: number, newName: string, newDimension: number) {
    axios
      .patch(`http://localhost:8080/api/fitnessFunction/${id}`, {
        id: id,
        name: newName,
        dimension: newDimension,
        domainArray: formFields,
      })
      .then((res) => {
        const nextResult = [...result];
        const newFunction = nextResult.find((f) => f.id === id);
        if (newFunction) {
          newFunction.name = newName;
          newFunction.dimension = newDimension;
          newFunction.domainArray = formFields;
        }
        setResult(nextResult);
        setShowEditModal(false);
        setError([]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAddClick(name: string, dimension: any, file: File) {
    setError([]);
    let formData = new FormData();
    formData.append('file', file);
    axios
      .post(`http://localhost:8080/api/fitnessFunction/file/`, formData)
      .then((res) => {
        if (dimension == '') dimension = null;
        const newFitnessFunctionDto = {
          name: name,
          fileName: file.name,
          dimension: parseInt(dimension),
          domainArray: formFields,
          removeable: true,
        };
        axios
          .post(
            `http://localhost:8080/api/fitnessFunction/`,
            JSON.stringify(newFitnessFunctionDto),
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          )
          .then((res) => {
            newFitnessFunctionDto.id = res.data;
            setResult([...result, newFitnessFunctionDto]);
            setError([]);
            setShowAddModal(false);
          })
          .catch((err) => {
            console.error(err);
            if (err.response.data.errors !== undefined) {
              const errors = Object.values(err.response.data.errors).flat();
              setError(errors);
            } else {
              setError([err.response.data]);
            }
          });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.errors !== undefined) {
          const errors = Object.values(err.response.data.errors).flat();
          setError(errors);
        } else {
          setError([err.response.data]);
        }
      });
  }

  const setNewDimension = (dimension: number) => {
    setFormFields([]);
    let fields = []
    for (let i = 0; i < dimension; i++) {
      fields.push([0.0, 0.0])
    }
    setDimension(dimension);
    setFormFields(fields);
  }

  const setEditFields = (domainArray: any) => {
    setFormFields(domainArray);
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 mt-2">Funkcje celu</h1>
      <div className="flex flex-col gap-10">
        <FitnessComponent
          functions={result}
          formFields={formFields}
          handleFormChange={handleFormChange}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          handleAddClick={handleAddClick}
          error={error}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newDimension={dimension}
          setNewDimension={setNewDimension}
          setEditFields={setEditFields}
        />
      </div>
    </>
  );
};

export default Fitness;
