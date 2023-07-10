// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id="nav-bar">
      <li className="navs" id="home-container">
        <NavLink exact to="/" id="home-text">
          <img id="home-img" src="https://1000logos.net/wp-content/uploads/2021/12/Akatsuki-Logo.jpg" alt="not available"></img>
          CloudBnB
        </NavLink>
      </li>
      {isLoaded && (
        <li id="right-nav-cont">
          {sessionUser && (
            <NavLink exact to="/spots/new" id="new-spot" className={sessionUser ? "logged-in-right-nav" : 'other-unused'}>Create a New Spot &nbsp; &nbsp; </NavLink>
          )}
          <div className="navs" id="btn-container">
            <ProfileButton user={sessionUser} />
          </div>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
