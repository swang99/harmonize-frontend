import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <div>
        <NavLink to="/home">
          Home
        </NavLink>
      </div>
      <div>
        <NavLink to="/">
          Login
        </NavLink>
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
