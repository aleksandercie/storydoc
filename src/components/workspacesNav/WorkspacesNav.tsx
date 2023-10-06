import './WorkspacesNav.scss';
import { NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import { Home, Layout, Search, User } from '../../assets/icons';

export const WorkspacesNav = () => {
  const links = useMemo(
    () => [
      { name: 'Dashboard', icon: <Home />, to: '/dashboard' },
      { name: 'Boards', icon: <Layout />, to: '/' },
      { name: 'Profile', icon: <User />, to: '/profile' },
      { name: 'Search', icon: <Search />, to: '/search' },
    ],
    []
  );

  return (
    <div className='nav'>
      {links.map(({ name, icon, to }) => (
        <NavLink
          key={name}
          to={to}
          className={({ isActive }) =>
            isActive ? 'nav-link active' : 'nav-link'
          }
        >
          {icon}
          <p className='nav-name name'>{name}</p>
        </NavLink>
      ))}
    </div>
  );
};
