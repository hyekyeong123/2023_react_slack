import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from '@layouts/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import loadable from '@loadable/component';

// import Login from '@pages/Login/Login'; // 코드 스플리팅 적용 전
const Login = loadable(() => import('@pages/login/Login')); // 코드 스플리팅 적용 후
const SignUp = loadable(() => import('@pages/signup/SignUp'));

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  {
    path: '/',
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById('app') as Element).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
