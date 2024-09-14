import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root.tsx';
import Signup from './routes/Signup.tsx';
import Login from './routes/Login.tsx';
import Home from './routes/Home.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';
import Profile from './routes/Profile.tsx';
import ProfileEdit from './routes/ProfileEdit.tsx';
import Search from './routes/Search.tsx';
import Post from './routes/Post.tsx';
import Request from './routes/Request.tsx';
import Following from './routes/Following.tsx';
import Follower from './routes/Follower.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'request',
        element: <Request />,
      },
      {
        path: 'user/edit',
        element: <ProfileEdit />,
      },
      {
        path: 'user/:id',
        element: <Profile />,
      },
      {
        path: 'post/:id',
        element: <Post />,
      },
      {
        path: 'user/:id/following',
        element: <Following />,
      },
      {
        path: 'user/:id/follower',
        element: <Follower />,
      },
    ],
  },
]);

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
