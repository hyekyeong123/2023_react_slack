import React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from '@layouts/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import loadable from '@loadable/component';
import Test from "./test/Test";

// import Login from '@pages/Login/Login'; // 코드 스플리팅 적용 전
const Login = loadable(() => import('@pages/login/Login')); // 코드 스플리팅 적용 후
const SignUp = loadable(() => import('@pages/signup/SignUp'));
const Workspace = loadable(() => import('@layouts/workspace/Workspace'));
const Channel = loadable(() => import('@pages/channel/Channel'));
const DirectMessage = loadable(() => import('@pages/directMessage/DirectMessage'));

const router = createBrowserRouter([
  { path: '/', element: <App />, },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
  
  
  { path: '/workspace/:workspace', element: <Workspace /> },
  { path: '/workspace/:workspace/channel/:channel', element: <Channel/> },
  { path: '/workspace/:workspace/dm/:id', element: <DirectMessage/> },
]);
ReactDOM.createRoot(document.getElementById('app') as Element).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
