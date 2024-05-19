import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './login/auth-context';

const NavBar = () => {
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Ensure that logout is being called when the button is clicked
  };

  return (
    <div>
      <div>
        <NavLink to="/home">
          Home
        </NavLink>
      </div>
      <div>
        <a href="/" onClick={handleLogout}>
          Logout
        </a>
      </div>
      <div>
        <NavLink to="/users/test1">
          Profile
        </NavLink>
      </div>
      <div>
        <NavLink to="/search">
          Search
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
