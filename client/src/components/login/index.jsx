import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios"

const Login=()=>{
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        try {
            const data={
                email,
                password
            }
            const response=await axios.post('/login', data)
            console.log(response.status)
            if(response.status===404){
                alert('Email not found')
            }else if(response.status===401){
                alert('Incorrect Password')
            }else if(response.status===200){
                setRedirect(true)
            }
        } catch (error) {
            console.log("Error sending data to server",error)
        }
    }

    if(redirect){
        return(
            <Navigate to='/'/>
        )
    }

    return(
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Enter your email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label"> Enter your password
                            </label>
                            <input type="password" className="form-control" id="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-block">Login</button>
                    </form>
                    <p className="mt-3 text-center">Don't have an account? <Link to="/signUp">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
