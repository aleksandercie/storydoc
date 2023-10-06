import './App.scss';
import { useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkspaceList } from './components/workspaceList';
import { WorkspacesSidebar } from './components/workspacesSidebar';
import { selectState } from './store/slices';

export const App = () => {
  const {
    board: { activeWorkspace },
  } = useSelector(selectState);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <div className='container'>
              <WorkspacesSidebar />
              {activeWorkspace ? <WorkspaceList /> : null}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
