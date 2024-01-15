import { Fragment, useState } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import Checkbox from '../components/Checkbox';

const Fitness = ({
  firstAlgorithm,
  firstFunction,
  algorithms,
  functions,
  handleDeleteClick,
  handleTestAlgorithmClick,
  handleTestFunctionClick,
  algorithmTestRunning,
  fitnessTestRunning,
  progress,
  results,
  sessions,
  resumeSession,
  setPDFDownloadLink,
  abortSession,
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedAlgorithmTest, setSelectedAlgorithmTest] =
    useState(firstAlgorithm);
  const [selectedFunctionsTest, setSelectedFunctionsTest] = useState([]);
  const [selectedFunctionTest, setSelectedFunctionTest] =
    useState(firstFunction);
  const [selectedAlgorithmsTest, setSelectedAlgorithmsTest] = useState([]);

  const addSelectedFunctionCheckbox = (name: string) => {
    const selectedFun = [...selectedFunctionsTest];
    if (selectedFun.indexOf(name) === -1) {
      selectedFun.push(name);
    } else {
      selectedFun.splice(selectedFun.indexOf(name), 1);
    }
    setSelectedFunctionsTest(selectedFun);
  };

  const addSelectedAlgorithmCheckbox = (name: string) => {
    const selectedAlgo = [...selectedAlgorithmsTest];
    if (selectedAlgo.indexOf(name) === -1) {
      selectedAlgo.push(name);
    } else {
      selectedAlgo.splice(selectedAlgo.indexOf(name), 1);
    }
    setSelectedAlgorithmsTest(selectedAlgo);
  };

  return (
    <main>
      <div className="grid grid-cols-2 gap-x-8">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {algorithmTestRunning === true ? (
            <Fragment>
              <div className="p-6.5">
                <h1 className="font-bold text-3xl text-center">
                  Testowanie algorytmu trwa...
                </h1>
                <div className="flex mt-32 items-center justify-center bg-white">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                </div>
                <div className="mt-16">
                  {progress.map((p) => {
                    return (
                      <p className="text-sm mb-1">
                        Testowanie funkcją{' '}
                        {
                          functions.find((f) => f.id === p.fitnessFunctionId)
                            .name
                        }
                        ... {p.progress}%
                      </p>
                    );
                  })}
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="p-6.5">
                {results.length > 0 ? (
                  results.map((res) => {
                    return (
                      <div className="grid grid-cols-2">
                        <h1 className="font-bold text-3xl text-center">
                          Testowanie zakończone!
                        </h1>
                        <div className="mt-16">
                          <div className="w-full mb-4">
                            <p className="block text-black dark:text-white">
                              Algorytm
                            </p>
                            <p className="text-lg font-bold">
                              {
                                algorithms.find((a) => a.id === res.AlgorithmId)
                                  .name
                              }
                            </p>
                          </div>
                          <div className="w-full mb-4">
                            <p className="block text-black dark:text-white">
                              Funkcja testowa
                            </p>
                            <p className="text-lg font-bold">
                              {
                                functions.find(
                                  (f) => f.id === res.FitnessFunctionId,
                                ).name
                              }
                            </p>
                          </div>
                          <div className="w-full mb-4">
                            <p className="block text-black dark:text-white">
                              Parametry
                            </p>
                            <p className="text-lg font-bold">
                              {Object.entries(res.BestParams).map((par) => {
                                return (
                                  <h1>
                                    {par[0]}: {par[1]}
                                  </h1>
                                );
                              })}
                            </p>
                          </div>
                          <div className="w-full mb-4">
                            <p className="block text-black dark:text-white">
                              Najlepszy fitness
                            </p>
                            <p className="text-lg font-bold">
                              {res.BestFitness}
                            </p>
                          </div>
                          <div className="w-full mb-4">
                            <p className="block text-black dark:text-white">
                              Najlepsza pozycja
                            </p>
                            <p className="text-lg font-bold">
                              {res.BestPosition}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Fragment>
                    <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Testuj algorytm funkcjami testowymi
                      </h3>
                    </div>
                    <div className="p-6.5">
                      <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full">
                          <label className="mb-2.5 block text-black dark:text-white">
                            Algorytm
                          </label>
                          <select
                            name="algorithm"
                            className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            onChange={(ev) =>
                              setSelectedAlgorithmTest(ev.target.value)
                            }
                            value={selectedAlgorithmTest}
                          >
                            {algorithms.map((alg) => {
                              return <option value={alg.id}>{alg.name}</option>;
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="mb-16">
                        <label className="mb-2.5 block text-black dark:text-white">
                          Funkcje testowe <span className="text-meta-1">*</span>
                        </label>
                        {functions.map((fun) => {
                          return (
                            <div className="grid grid-cols-2 mb-4">
                              <Checkbox
                                id={fun.id}
                                name={fun.name}
                                changeHandler={addSelectedFunctionCheckbox}
                              />
                            </div>
                          );
                        })}
                      </div>
                      {(selectedFunctionsTest.length === 0 || fitnessTestRunning === true) && (
                        <button
                          disabled
                          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white"
                          onClick={() => {
                            handleTestAlgorithmClick(
                              selectedAlgorithmTest,
                              selectedFunctionsTest,
                            );
                          }}
                        >
                          Testuj algorytm!
                        </button>
                      )}
                      {(selectedFunctionsTest.length > 0 && fitnessTestRunning === false) && (
                        <button
                          className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white"
                          onClick={() => {
                            handleTestAlgorithmClick(
                              selectedAlgorithmTest,
                              selectedFunctionsTest,
                            );
                          }}
                        >
                          Testuj algorytm!
                        </button>
                      )}
                    </div>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}
        </div>
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {fitnessTestRunning === true ? (
            <Fragment>
              <div className="p-6.5">
                <h1 className="font-bold text-3xl text-center">
                  Testowanie funkcji trwa...
                </h1>
                <div className="flex mt-32 items-center justify-center bg-white">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mb-32"></div>
                </div>
                <div className="mt-16">
                  {progress.map((p) => {
                    return (
                      <p className="text-sm mb-1">
                        Testowanie algorytmem{' '}
                        {algorithms.find((a) => a.id === p.algorithmId).name}...{' '}
                        {p.progress}%
                      </p>
                    );
                  })}
                </div>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Testuj funkcję algorytmami
                </h3>
              </div>
              <div className="p-6.5">
                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                  <div className="w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Funkcja
                    </label>
                    <select
                      className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                      onChange={(ev) =>
                        setSelectedFunctionTest(ev.target.value)
                      }
                      value={selectedFunctionTest}
                    >
                      {functions.map((fun) => {
                        return <option value={fun.name}>{fun.name}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div className="mb-16">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Algorytmy <span className="text-meta-1">*</span>
                  </label>
                  {algorithms.map((alg) => {
                    return (
                      <div key={alg.id} className="grid grid-cols-2 mb-4">
                        <Checkbox
                          id={alg.id}
                          name={alg.name}
                          changeHandler={addSelectedAlgorithmCheckbox}
                        />
                      </div>
                    );
                  })}
                </div>
                {(selectedAlgorithmsTest.length === 0 || algorithmTestRunning === true ) && (
                  <button
                    disabled
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white"
                    onClick={() => {
                      handleTestFunctionClick(
                        selectedFunctionTest,
                        selectedAlgorithmsTest,
                      );
                    }}
                  >
                    Testuj funkcję!
                  </button>
                )}
                {(selectedAlgorithmsTest.length > 0 && algorithmTestRunning === false ) && (
                  <button
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white"
                    onClick={() => {
                      handleTestFunctionClick(
                        selectedFunctionTest,
                        selectedAlgorithmsTest,
                      );
                    }}
                  >
                    Testuj funkcję!
                  </button>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-4">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Id sesji
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Testowane algorytmy
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Testowane funkcje celu
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Status
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                return (
                  <tr key={session.sessionId}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {session.sessionId} 
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {session.algorithms.map((alg) => {
                          return alg;
                        })}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {session.fitnessFunctions.map((func) => {
                          return `${func} `;
                        })}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {session.state === 'FINISHED' && (
                        <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                          {session.state}
                        </p>
                      )}

                      {session.state === 'SUSPENDED' && (
                        <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                          {session.state}
                        </p>
                      )}

                      {session.state === 'RUNNING' && (
                        <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-primary">
                          {session.state}
                        </p>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {session.state === 'RUNNING' && (
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              abortSession(
                                session.sessionId,
                                session.isAlgorithmTested,
                                session.algorithms,
                                session.fitnessFunctions,
                              );
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="16"
                              viewBox="0 0 512 512"
                            >
                              <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                            </svg>
                          </button>
                        )}
                        {session.state === 'SUSPENDED' && (
                          <button
                            onClick={() => {
                              resumeSession(
                                session.sessionId,
                                session.isAlgorithmTested,
                                session.algorithms,
                                session.fitnessFunctions,
                              );
                            }}
                            className="hover:text-primary"
                          >
                            <svg
                              className="fill-current"
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="12"
                              viewBox="0 0 384 512"
                            >
                              <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                            </svg>
                          </button>
                        )}
                        <button
                          className="hover:text-primary"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setSelectedItemId(session.sessionId);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        {session.state === 'FINISHED' && (
                          <button
                            className="hover:text-primary"
                            onClick={() => {
                              setPDFDownloadLink(session.sessionId);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="16"
                              width="16"
                              viewBox="0 0 512 512"
                            >
                              <path
                                opacity="1"
                                fill="#1E3050"
                                d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"
                              />
                            </svg>
                          </button>
                        )}

                        <Modal
                          show={openDeleteModal}
                          size="md"
                          onClose={() => setOpenDeleteModal(false)}
                          popup
                        >
                          <Modal.Header />
                          <Modal.Body>
                            <div className="text-center">
                              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                Czy na pewno usunąć?
                              </h3>
                              <div className="flex justify-center gap-4">
                                <Button
                                  color="failure"
                                  onClick={() => {
                                    handleDeleteClick(selectedItemId);
                                    sessions.splice(
                                      sessions.findIndex(
                                        (a) => a.sessionId === selectedItemId,
                                      ),
                                      1,
                                    );
                                    setSelectedItemId('');
                                    setOpenDeleteModal(false);
                                  }}
                                >
                                  {'Tak, usuwaj'}
                                </Button>
                                <Button
                                  color="gray"
                                  onClick={() => setOpenDeleteModal(false)}
                                >
                                  Nie, anuluj
                                </Button>
                              </div>
                            </div>
                          </Modal.Body>
                        </Modal>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Fitness;
