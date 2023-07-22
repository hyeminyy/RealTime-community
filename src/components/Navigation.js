import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";

const Navigation = ({ userObj }) => (
  <nav>
    <ul>
      <li>
        <Link to="/" className="nav">🏠Home</Link>
      </li>
      <li>
        <Link to="/Profile" className="nav">
          {userObj && userObj.displayName
            ? `${userObj.displayName}'profile💙`
            : "Profile"}
        </Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
