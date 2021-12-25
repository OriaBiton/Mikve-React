import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
export default function Nav(){
  const {user} = useContext(AuthContext).auth;
  return (
    <>
      <div id="is-nav"></div>
      <nav>
        <div className="nav-toggle">
          <div className="nav-toggle-bar"></div>
        </div>
        <div className="container nav">
          <ul>
            <li>
              <Link to="/">🏠 בית</Link>
            </li>
            {user && <li>
              <Link to="/settings">⚙️ הגדרות</Link>
            </li>}
          </ul>
        </div>
      </nav>
    </>
  );
}