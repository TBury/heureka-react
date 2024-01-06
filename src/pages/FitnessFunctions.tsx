import { useEffect, useState } from 'react';
import FitnessComponent from '../components/Fitness';
import axios from 'axios';

const Fitness = () => {
  const [result, setResult] = useState([])
  const [response, setResponse] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState([]);
  const [formFields, setFormFields] = useState([])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][parseInt(event.target.name)] = parseInt(event.target.value);
    setFormFields(data);
  }

  const addFields = () => {
    let object = {
      left: '',
      right: ''
    }
    setFormFields([...formFields, [parseInt(object.left), parseInt(object.right)]])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  useEffect(() => {
    fetch('http://localhost:8080/api/fitnessFunction/')
    .then(res => res.json())
    .then(data => {
      setResult(data);
    })
  }, [])

  const handleDeleteClick = (id) => 
    axios.delete(`http://localhost:8080/api/fitnessFunction/${id}`)
  .then((res) => {
    setResponse("Deleted");
  })
  .catch((err) => {
    console.error(err)
  })

  const handleEditClick = (id: any, newName: string, newDimension: number) => 
    axios.patch(`http://localhost:8080/api/fitnessFunction/${id}`, {
      id: id,
      name: newName,
      dimension: newDimension,
      domainArray: formFields,
  })
  .then((res) => {
    setResponse("Created");
  })
  .catch((err) => {
    console.error(err)
  })


  const handleAddClick = (name: string, dimension: number, file: File) => {
    setError([])
    let formData = new FormData();
    formData.append('file', file);
    axios.post(`http://localhost:8080/api/fitnessFunction/file/`, formData)
    .then((res) => {
      const newFitnessFunctionDto = {
        name: name,
        fileName: file.name,
        dimension: dimension,
        domainArray: formFields,
        removable: true
      }
      axios.post(`http://localhost:8080/api/fitnessFunction/`, 
        JSON.stringify(newFitnessFunctionDto),
        {
          headers: {
            'Content-Type': 'application/json' ,
            'Accept': 'application/json' ,
          }
        }
      )
      .then((res) => {
        setResponse("Created");
      })
      .catch(err => {
        if (err.response.data.errors !== undefined) {
          const errors = Object.values(err.response.data.errors).flat()
          setError(errors)
        }
        else {
          setError([err.response.data])
        }
      })
    })
    .catch(err => {
      setResponse("error")
      if (err.response.data.errors !== undefined) {
        const errors = Object.values(err.response.data.errors).flat()
        setError(errors)
      }
      else {
        setError([err.response.data])
      }
    })
  }
    

  
  return (
    <>
      <h1 className='text-3xl font-bold mb-8 mt-2'>Funkcje celu</h1>
      <div className="flex flex-col gap-10">
        <FitnessComponent 
          functions={result}
          formFields={formFields}
          handleFormChange={handleFormChange}
          addFields={addFields}
          removeFields={removeFields}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          handleAddClick={handleAddClick}
          response={response}
          error={error}
          domain={formFields}
        />
      </div>
    </>
  );
};

export default Fitness;
