import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../Context/GlobalContext";

const CompanyNav = () => {
  const {handleLogout} = useContext(GlobalContext)
  return (
    <>
      <div className="container">
        <nav className="NavClassCompany">
          <div>
            <h1>Company DashBoard</h1>
          </div>
          <div className="Nav_Item_Company">
           <Link to="/StudentsResume"><button>Available Candidate</button></Link> 
           <Link to="/JobPost"> <button>Job Creation</button></Link>
           <Link to="/AppliedCandidate"> <button>Applied Candidate</button></Link>
           <button onClick={handleLogout} > LogOut </button>
          </div>
        </nav>
      </div>
    </>
  );
};
export default CompanyNav;
