import Step1 from '../images/step1.png';
import Step2 from '../images/step2.png';
import Step3 from '../images/step3.png';
import Step4 from '../images/step4.png';
import Step5 from '../images/step5.png';
import Step6 from '../images/step6.png';
import Step7 from '../images/step7.png';
import Step8 from '../images/step8.png';

const Instrukcja = () => {
  return (
    <main>
        <p className='mb-4'>Aby rozpocząć pracę z systemem, należy dodać funkcję celu: </p>
        <img src={Step1} className='mb-8' />
        <p className="mb-4">Należy wypełnić poprawną nazwę funkcji celu, podać jej wymiar, dziedzinę oraz plik .dll. Jeżeli wymiar pozostanie pusty, to zostanie odgórnie przyjęty wymiar oraz dziedzina. Wymiar równy 0 oznaczać będzie wymiar dowolny. Wtedy należy wpisać przedział [min, max] dla dziedziny. Funkcja musi być osobną klasą o nazwie podanej w formularzu i musi implementować interfejs <code>IFitnessFunction</code>.</p>
        <img src={Step2} className='mb-8' />
        <p className="mb-4">Analogicznie należy postąpić przy dodawaniu algorytmu. Algorytm musi być osobną klasą o nazwie takiej, jak podano w formularzu i implementować interfejs IOptimizationAlgorithm.</p>
        <img src={Step3} className='mb-8' />
        <p className="mb-4">Należy zadbać, by nazwa pliku nie występowała już na serwerze.</p>
        <img src={Step4} className='mb-8' />
        <p className="mb-4">Po dodaniu algorytmów i funkcji celu, można uruchomić zadanie - testowanie algorytmu funkcjami celu lub odwrotnie. Należy wybrać odpowiedni algorytm i funkcję celu.</p>
        <img src={Step5} className='mb-8' />
        <p className="mb-4">Po uruchomieniu zadania, następuje jego trening. Po zakończeniu w oknie pojawią się rezultaty.</p>
        <img src={Step6} className='mb-8' />
        <p className="mb-4">Uruchomione zadania można wstrzymać klikając przycisk po lewej stronie.</p>
        <img src={Step7} className='mb-8' />
        <p className="mb-4">Wstrzymane zadania można uruchomić ponownie klikając przycisk Start. Jego postęp zostanie wznowiony na podstawie danych z bazy.</p>
        <img src={Step8} className='mb-8' />
    </main>
  );
};

export default Instrukcja;
