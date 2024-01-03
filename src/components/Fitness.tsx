import { useState } from 'react';
import { Button, Label, Modal, TextInput, FileInput } from 'flowbite-react';

const Fitness = ({ functions, formFields, handleFormChange, addFields, domain, removeFields, handleDeleteClick, handleEditClick, handleAddClick, response, error }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDimension, setNewDimension] = useState('');
  const [newFunctionName, setnewFunctionName] = useState('');
  const [newFile, setNewFile] = useState();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  const setFileHandler = (event) => {
    setNewFile(event.target.files[0]);
  };


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Button color="blue" className="mb-8" onClick={() => setOpenAddModal(true)}>+ Dodaj nową funkcję</Button>
      <Modal show={openAddModal} size="md" onClose={() => setOpenAddModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          {error.length > 0 &&
            <div className="flex w-full bg-[#F87171] bg-opacity-[15%] py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 px-4 mb-5 gap-2">
              <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.4917 7.65579L11.106 12.2645C11.2545 12.4128 11.4715 12.5 11.6738 12.5C11.8762 12.5 12.0931 12.4128 12.2416 12.2645C12.5621 11.9445 12.5623 11.4317 12.2423 11.1114C12.2422 11.1113 12.2422 11.1113 12.2422 11.1113C12.242 11.1111 12.2418 11.1109 12.2416 11.1107L7.64539 6.50351L12.2589 1.91221L12.2595 1.91158C12.5802 1.59132 12.5802 1.07805 12.2595 0.757793C11.9393 0.437994 11.4268 0.437869 11.1064 0.757418C11.1063 0.757543 11.1062 0.757668 11.106 0.757793L6.49234 5.34931L1.89459 0.740581L1.89396 0.739942C1.57364 0.420019 1.0608 0.420019 0.740487 0.739944C0.42005 1.05999 0.419837 1.57279 0.73985 1.89309L6.4917 7.65579ZM6.4917 7.65579L1.89459 12.2639L1.89395 12.2645C1.74546 12.4128 1.52854 12.5 1.32616 12.5C1.12377 12.5 0.906853 12.4128 0.758361 12.2645L1.1117 11.9108L0.758358 12.2645C0.437984 11.9445 0.437708 11.4319 0.757539 11.1116C0.757812 11.1113 0.758086 11.111 0.75836 11.1107L5.33864 6.50287L0.740487 1.89373L6.4917 7.65579Z"
                    fill="#ffffff"
                    stroke="#ffffff"
                  ></path>
                </svg>
              </div>
              <div className="w-full">
                <h5 className="mb-3 font-semibold text-[#B45454]">
                  Błąd dodawania funkcji
                </h5>
                <ul>
                  {error.map((e) => {
                    return <li className="leading-relaxed text-[#CD5D5D]">
                      {e}
                    </li>
                  })}

                </ul>
              </div>
            </div>
          }
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Dodaj nową funkcję</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="newFunctionName" value="Nazwa funkcji celu" />
              </div>
              <TextInput
                id="newFunctionName"
                placeholder="np. Rastrigin"
                value={newFunctionName}
                onChange={(event) => setnewFunctionName(event.target.value)}
                required
              />

            </div>
            <div>
              <div className="mb-2 mt-4 block">
                <Label htmlFor="newDimension" value="Wymiar" />
              </div>
              <TextInput
                type="number"
                id="newDimension"
                placeholder=""
                value={newDimension}
                onChange={(event) => setNewDimension(event.target.value)}
                required
                helperText={
                  <>
                    Jeżeli wymiar to nieskończoność, pozostaw pole puste. Jeżeli dowolny wymiar, wstaw 0.
                  </>
                }
              />
            </div>
            <div>
              <div className="mb-2 mt-4 block">
                <Label htmlFor="newDomain" value="Dziedzina" />
              </div>
              {formFields.map((form, index) => {
                return (
                  <div key={index} className='flex flex-row gap-4'>
                    <TextInput
                      name="0"
                      type="number"
                      placeholder=""
                      onChange={event => handleFormChange(event, index)}
                      value={form.left}
                    />
                    <TextInput
                      name="1"
                      type="number"
                      placeholder=""
                      onChange={event => handleFormChange(event, index)}
                      value={form.right}
                    />
                    <button onClick={() => removeFields(index)}>Usuń</button>
                  </div>
                )
              })}
              <button onClick={addFields}>+ Dodaj</button>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="algoFile" value="Plik .dll" />
              </div>
              <FileInput id="file" onChange={setFileHandler} />
            </div>
            <div className="w-full">
              <Button color="blue" onClick={() => {
                handleAddClick(newFunctionName, newDimension, newFile)
                if (response === "Created") {
                  functions.push({
                    id: functions.at(-1).id + 1,
                    name: newFunctionName,
                    dimension: newDimension,
                    domainArray: domain, 
                    removeable: "True",
                  })
                  setOpenAddModal(false);
                }
                else {
                  console.error(response)
                }

              }}>Dodaj funkcję</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Nazwa algorytmu
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Wymiar
              </th>
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Dziedzina
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Usuwalny?
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody>
            {functions.map((fun) => {
              return <tr key={fun.id} >
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {fun.name}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {fun.dimension}
                  </h5>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {fun.domainArray.length === 0 ? "niezdefiniowana" :

                      fun.domainArray.map((d) => {
                        return `[${d.map((e) => {
                          return `${e}`
                        })}] `

                      })

                    }
                  </h5>
                </td>
                {fun.removeable == 1 || fun.removeable == "true" ?
                
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-success bg-opacity-10 py-1 px-3 text-sm font-medium text-success">
                      Tak
                    </p>
                  </td>
                  :
                  
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="inline-flex rounded-full bg-danger bg-opacity-10 py-1 px-3 text-sm font-medium text-danger">
                      Nie
                    </p>
                  </td>
                }
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <button data-index={fun.id} onClick={() => {
                      setOpenEditModal(true);
                      setSelectedItemId(fun.id)
                      setSelectedItem(fun.name)
                    }} className="hover:text-primary">
                      <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path opacity="1" fill="#1E3050" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg>
                    </button>
                    <Modal show={openEditModal} size="md" onClose={() => setOpenEditModal(false)} popup>
                      <Modal.Header />
                      <Modal.Body>
                        <div className="space-y-6">
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edytuj funkcję</h3>
                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="newName" value="Nazwa" />
                            </div>
                            <TextInput
                              id="newName"
                              placeholder={selectedItem}
                              value={newName}
                              onChange={(event) => setNewName(event.target.value)}
                              required
                            />
                            <div className="mb-2 mt-4 block">
                              <Label htmlFor="newDimension" value="Wymiar" />
                            </div>
                            <TextInput
                              type="number"
                              id="newDimension"
                              placeholder=""
                              value={newDimension}
                              onChange={(event) => setNewDimension(event.target.value)}
                              required
                              helperText={
                                <>
                                  Jeżeli wymiar to nieskończoność, pozostaw pole puste. Jeżeli dowolny wymiar, wstaw 0.
                                </>
                              }
                            />
                            <div>
                              <div className="mb-2 mt-4 block">
                                <Label htmlFor="newDomain" value="Dziedzina" />
                              </div>
                              {formFields.map((form, index) => {
                                return (
                                  <div key={index} className='flex flex-row gap-4'>
                                    <TextInput
                                      name="left"
                                      type="number"
                                      placeholder=""
                                      onChange={event => handleFormChange(event, index)}
                                      value={form.left}
                                    />
                                    <TextInput
                                      name="right"
                                      type="number"
                                      placeholder=""
                                      onChange={event => handleFormChange(event, index)}
                                      value={form.right}
                                    />
                                    <button onClick={() => removeFields(index)}>Usuń</button>
                                  </div>
                                )
                              })}
                              <button onClick={addFields}>+ Dodaj</button>
                            </div>
                          </div>
                          <div className="w-full">
                            <Button color="blue" onClick={() => {
                              handleEditClick(selectedItemId, newName);
                              const editedFunction = functions.find(a => a.id === selectedItemId);
                              editedFunction.name = newName;
                              editedFunction.dimension = newDimension;
                              setSelectedItemId('');
                              setSelectedItem('');
                              setOpenEditModal(false);
                            }}>Edytuj funkcję</Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                    {fun.removeable === true &&
                      <button className="hover:text-primary" onClick={() => setOpenDeleteModal(true)}>
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
                    }
                    <Modal show={openDeleteModal} size="md" onClose={() => setOpenDeleteModal(false)} popup>
                      <Modal.Header />
                      <Modal.Body>
                        <div className="text-center">

                          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Czy na pewno usunąć?
                          </h3>
                          <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {
                              handleDeleteClick(fun.id);
                              if(response === "Deleted") {
                                functions.splice(
                                  functions.findIndex(a => a.id === fun.id),
                                  1
                                )
                                setSelectedItemId('');
                                setOpenDeleteModal(false);
                              }
                            }}>
                              {"Tak, usuwaj"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                              Nie, anuluj
                            </Button>
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>



                  </div>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fitness;
