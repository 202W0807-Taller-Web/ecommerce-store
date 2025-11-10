import { Outlet } from 'react-router-dom';
import { MainLayout } from './MainLayout';

const MainRoutesLayout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default MainRoutesLayout;
