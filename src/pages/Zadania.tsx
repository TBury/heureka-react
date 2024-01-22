import { useEffect, useRef, useState } from 'react';
import TasksComponent from '../components/Tasks';
import axios from 'axios';
import Cookies from 'universal-cookie';



const Fitness = () => {
  const [algorithms, setAlgorithms] = useState([]);
  const [functions, setFunctions] = useState([]);
  const [tasks, settasks] = useState([]);
  const [isAlgorithmTestRunning, setIsAlgorithmTestRunning] = useState(false);
  const [isFitnessTestRunning, setIsFitnessTestRunning] = useState(false);
  const [response, setResponse] = useState('');
  const [progress, setProgress] = useState([]);
  const cookies = new Cookies();

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

    if (cookies.get("testRunning")) {
      setInterval(handleProgress, 2500);
    }
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
    const progressInterval = setInterval(handleProgress, 2500);
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
    cookies.set('testRunning', 'algorithmTest', { path: '/' });
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
    const progressInterval = setInterval(handleProgress, 2500);
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
    cookies.set('testRunning', 'fitnessTest', { path: '/' });
    axios
      .request(config)
      .then((res) => {
        setIsFitnessTestRunning(false);
        setResponse(res.data);
        clearInterval(progressInterval);
        handleSessionChange();
        cookies.remove('testRunning');
      })
      .catch((err) => {
        setIsFitnessTestRunning(false);
        clearInterval(progressInterval);
        handleSessionChange();
        cookies.remove('testRunning');
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
      cookies.set('testRunning', 'fitnessTest', { path: '/' });
    } else {
      setIsAlgorithmTestRunning(true);
      cookies.set('testRunning', 'algorithmTest', { path: '/' });
    }
    setProgress([]);
    const progressInterval = setInterval(handleProgress, 2500);
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

  function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
  }

  const abortSession = async (id, isAlgorithmTested, algorithms, FitnessFunctions) => {
    if (!isAlgorithmTested) {
      setIsFitnessTestRunning(false);
      cookies.remove("testRunning")
    } else {
      setIsAlgorithmTestRunning(false);
    }
    cookies.remove("testRunning")
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setProgress([]);
    await timeout(500);
    axios
      .get('http://localhost:8080/api/session')
      .then((res) => {
        settasks(res.data);
      })
      .catch((err) => console.error(err));
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
            cookieValue={cookies.get("testRunning")}
          />
        )}
      </div>
    </>
  );
};

export default Fitness;
