import { useEffect, useRef, useState } from 'react';
import TasksComponent from '../components/Tasks';
import axios from 'axios';

const Fitness = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [tasks, settasks] = useState([]);
  const [isAlgorithmTestRunning, setIsAlgorithmTestRunning] = useState(false);
  const [isFitnessTestRunning, setIsFitnessTestRunning] = useState(false);
  const [response, setResponse] = useState('');
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/algorithm/')
      .then((res) => {
        setAlgorithms(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get('http://localhost:8080/api/fitnessFunction/')
      .then((res) => {
        setFunctions(res.data);
      })
      .catch((err) => console.error(err));
    axios
      .get('http://localhost:8080/api/session')
      .then((res) => {
        settasks(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDeleteClick = (id) =>
    axios
      .delete(`http://localhost:8080/api/session/${id}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  
  let abortControllerRef = useRef(new AbortController());
  const handleTestAlgorithmClick = (algorithm, functions) => {
    setIsAlgorithmTestRunning(true);
    const progressInterval = setInterval(handleProgress, 5000);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/task/algorithm/${algorithm}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: [...functions],
      signal: abortControllerRef.current.signal,
    };

    axios
      .request(config)
      .then((res) => {
        setIsAlgorithmTestRunning(false);
        setResponse(res.data);
        clearInterval(progressInterval);
        handleSessionChange();
      })
      .catch((err) => {
        setIsAlgorithmTestRunning(false);
        clearInterval(progressInterval);
        handleSessionChange();
        if(!axios.isCancel(err)) {
          console.error(err.response.data.errors);
        }
        else {
          console.log("poprawnie przerwano")
        }
      });
  };

  const handleTestFunctionClick = (fun, algorithms) => {
    setIsFitnessTestRunning(true);
    const progressInterval = setInterval(handleProgress, 5000);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/task/fitnessFunction/${fun}`,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortControllerRef.current.signal,
      data: JSON.stringify(algorithms),
    };
    handleSessionChange();
    axios
      .request(config)
      .then((res) => {
        setIsFitnessTestRunning(false);
        setResponse(res.data);
        clearInterval(progressInterval);
        handleSessionChange();
      })
      .catch((err) => {
        setIsFitnessTestRunning(false);
        clearInterval(progressInterval);
        handleSessionChange();
        if(!axios.isCancel(err)) {
          console.error(err.response.data.errors);
        }
        else {
          console.log("poprawnie przerwano")
        }
      });
  };

  const handleProgress = () => {
    handleSessionChange();
    axios
      .get(`http://localhost:8080/api/task`, {
        timeout: 360000,
      })
      .then((res) => {
        setProgress(res.data);
      })
      .catch((err) => console.error(err));
  };

  const handleSessionChange = () => {
    axios
      .get('http://localhost:8080/api/session')
      .then((res) => {
        settasks(res.data);
      })
      .catch((err) => console.error(err));
  };

  const resumeSession = (id, isAlgorithmTested, algorithms, FitnessFunctions) => {
    if (!isAlgorithmTested) {
      setIsFitnessTestRunning(true);
    } else {
      setIsAlgorithmTestRunning(true);
    }
    setProgress([]);
    const progressInterval = setInterval(handleProgress, 5000);
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `http://localhost:8080/api/task/${id}?resume=true`,
      headers: {
        'Content-Type': 'application/json',
      },
      signal: abortControllerRef.current.signal,
      data: {},
    };

    axios
    .request(config)
    .then((res) => {
      setResponse(res.data);
      clearInterval(progressInterval);
      handleSessionChange();
    })
    .catch((err) => {
      clearInterval(progressInterval);
      handleSessionChange();
      if(!axios.isCancel(err)) {
        console.error(err.response.data.errors);
      }
      else {
        console.log("poprawnie przerwano")
      }
    });
    handleSessionChange();
  };

  const getPDFDownloadLink = (id) => {
    axios
      .get(`http://localhost:8080/api/session/${id}/pdf`)
      .then((res) => {
        const url = res.data.replace('/app/wwwroot', '');
        location.assign(url);
      })
      .catch((err) => console.error(err));
  };

  const abortSession = (id, isAlgorithmTested, algorithms, FitnessFunctions) => {
    if (!isAlgorithmTested) {
      setIsFitnessTestRunning(false);
    } else {
      setIsAlgorithmTestRunning(false);
    }
    abortControllerRef.current.abort();
    handleSessionChange();
    abortControllerRef.current = new AbortController();
    setProgress([]);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 mt-2">Zadania</h1>
      <div className="flex flex-col gap-10">
        {algorithms.length > 0 && functions.length > 0 && (
          <TasksComponent
            firstAlgorithm={algorithms[0].id}
            firstFunction={functions[0].id}
            algorithms={algorithms}
            functions={functions}
            handleTestAlgorithmClick={handleTestAlgorithmClick}
            handleTestFunctionClick={handleTestFunctionClick}
            handleDeleteClick={handleDeleteClick}
            algorithmTestRunning={isAlgorithmTestRunning}
            fitnessTestRunning={isFitnessTestRunning}
            progress={progress}
            results={response}
            sessions={tasks}
            resumeSession={resumeSession}
            setPDFDownloadLink={getPDFDownloadLink}
            abortSession={abortSession}
          />
        )}
      </div>
    </>
  );
};

export default Fitness;
