import React from "react";
import { Link } from "react-router-dom";

const Header=()=>{
    return(
        <div className="d-flex justify-content-between align-items-center p-3 bg-light">
            <div className="d-flex align-items-center">
                <span className="me-3">LOGO</span>
            </div>
            <div className="d-flex gap-2 align-items-center">
                <Link to='/login' className="btn btn-primary">
                    Login
                </Link>
                <Link to='/signUp' className="btn btn-outline-primary">
                    Sign Up
                </Link>
            </div>
        </div>
    )
}

export default Header