import { lazy } from 'react';

const Zadania = lazy(() => import('../pages/Zadania'));
const Algorytmy = lazy(() => import('../pages/Algorytmy'));
const Fitness = lazy(() => import('../pages/FitnessFunctions'));
const Tasks = lazy(() => import('../pages/Zadania'));
const Instrukcja = lazy(() => import('../pages/Instrukcje'));

const coreRoutes = [
  {
    path: '/zadania',
    title: 'Zadania',
    component: Zadania,
  },
  {
    path: '/algorytmy',
    title: 'Algorytmy',
    component: Algorytmy,
  },
  {
    path: '/fitness',
    title: 'Fitness',
    component: Fitness,
  },
  {
    path: '/tasks',
    title: 'Tasks',
    component: Tasks,
  },
  {
    path: '/instrukcja',
    title: 'Instrukcja',
    component: Instrukcja,
  },
];

const routes = [...coreRoutes];
export default routes;
