import { useEffect, useState } from 'react';
import AlgorytmyComponent from '../components/Algorithms';
import axios from 'axios';

const Algorytmy = () => {
  const [result, setResult] = useState([])
  const [response, setResponse] = useState('');
  const [error, setError] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/algorithm/')
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => console.error(err))
  }, [])

  const handleDeleteClick = (id) => 
    axios.delete('http://localhost:8080/api/algorithm/', {
      id: id,
  })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err)
  })

  const handleEditClick = (id: any, newName: string) => 
    axios.patch(`http://localhost:8080/api/algorithm/${id}?newName=${newName}`, {
      id: id,
  })
  .then((res) => {
    setError([])
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

  const handleAddClick = (name: string, file: File) => {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('algorithmName', name);

    axios.postForm(`http://localhost:8080/api/algorithm/`, formData)
    .then((res) => {
      setError([])
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
  }
    
  return (
    <>
      <div className="flex flex-col gap-10">
        <AlgorytmyComponent 
          algorithms={result} 
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
          handleAddClick={handleAddClick}
          response={response}
          error={error}
        />
      </div>
    </>
  );
};

export default Algorytmy;
