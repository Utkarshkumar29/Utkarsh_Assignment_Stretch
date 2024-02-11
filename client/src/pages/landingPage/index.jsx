import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const LandingPage=()=>{
    const [accounts,setAccounts]=useState([])
    const [user,setUser]=useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [session,setSession]=useState(false)
    const alertShownRef=useRef(false)

    const fetchAccounts=async()=>{
        try {
            const response=await axios.get('https://bytive-backend-0vpg.onrender.com/accounts')
            const data=response.data
            setAccounts(data)
            console.log(response.data)
        } catch (error) {
            console.log("Error fetching accounts",error)
        }
    }

    const userInfo=async()=>{
        try {
            const response=await axios.get('https://bytive-backend-0vpg.onrender.com/user')
            const data=response.data
            setUser(data)
            setSession(true)
        } catch (error) {
            console.log("Error fetching user info",error)
        }
    }

    const handleDelete=async()=>{
        try {
            const response=await axios.delete(`https://bytive-backend-0vpg.onrender.com/delete/${user._id}`)
            if(response.status===200){
                alert('Profile Deleted Successfully!')
                userInfo()
            }
        } catch (error) {
            console.log("Error deleting account",error)
        }
    }

    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        account.bio.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const logout=async()=>{
        setUser('')
        console.log(user,'removeed')
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!alertShownRef.current) {
                alert('Session expired. Please login again.')
                alertShownRef.current=true
                logout()
                setSession(false)
            }
        }, 100000)
        return () => clearInterval(intervalId)
    },[])

    useEffect(()=>{
        fetchAccounts()
        userInfo()
    },[])

    return (
      <div className="container-fluid">
        <Header />

        <div className="container mt-4">
            {!session && <h2 className="mb-4 text-center bg-danger text-white p-3 rounded">Login to See Your Account</h2>}
            {user.name && (
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="mb-4">Your Account</h2>
                        <div className="card bg-light rounded">
                            <div className="card-body p-4">
                                <h1 className="display-4">{user.name}</h1>
                                <p className="lead">{user.bio}</p>
                                <img src={user.image} alt="Profile" className="img-fluid rounded shadow m-1" style={{maxWidth:"100px",height:"100px"}}/>
                                <div className="mb-3">
                                    <strong>LinkedIn:</strong> {user.linkedInURL}
                                </div>
                                <div className="mb-3">
                                    <strong>Website:</strong> {user.websiteURL}
                                </div>
                                <div className="mb-3">
                                    <strong>Twitter:</strong> {user.twitterURL}
                                </div>
                                <p>
                                    <strong>Seeking:</strong>
                                </p>
                                {user.seeking &&
                                    user.seeking.map((item, index) => (
                                        <span key={index} className="badge bg-secondary me-2">{item}</span>
                                    ))}
                                <p className="mt-3">
                                    <strong>Field of Interest:</strong> {user.fieldOfInterest}
                                </p>
                                <p>
                                    <strong>Location:</strong> {user.location}
                                </p>
                                <div className="mb-3">
                                    <strong>Tech Stack: </strong>
                                    {user.techStack &&user.techStack.map((item, index) => (
                                        <span key={index} className="badge bg-primary me-2">{item}</span>
                                    ))}
                                </div>
                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p>
                                    <strong>GitHub:</strong> {user.githubURL}
                                </p>
                                <Link to={`/signUp/${user._id}`} className="btn btn-primary me-2"> <FontAwesomeIcon icon={faEdit} className="me-1" /> Edit</Link>
                                <button className="btn btn-danger" onClick={handleDelete}><FontAwesomeIcon icon={faTrash} className="me-1" />Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="container mt-5">
            <h2 className="mb-4">Other User's Accounts</h2>
            <div className="mb-3">
                <input type="text" placeholder="Search by name, tech stack, or bio" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control"/>
            </div>
            <div className="row">
                {filteredAccounts && filteredAccounts.map((account,index)=>(
                    <div key={index} className="col-12 mb-4">
                        <div className="card bg-light rounded">
                            <div className="card-body p-4">
                                <img src={account.image} alt="Profile" className="img-fluid rounded shadow" style={{ maxWidth:"100px", height:"100px" }}/>
                                <h5 className="mt-3">{account.name}</h5>
                                <p className="text-muted">{account.bio}</p>
                                <div className="mb-3">
                                    <strong>LinkedIn:</strong> {account.linkedInURL}
                                </div>
                                <div className="mb-3">
                                    <strong>Website:</strong> {account.websiteURL}
                                </div>
                                <div className="mb-3">
                                    <strong>Twitter:</strong> {account.twitterURL}
                                </div>
                                <p>
                                    <strong>Seeking:</strong>
                                </p>
                                {account.seeking && account.seeking.map((item, index) => (
                                    <span key={index} className="badge bg-secondary me-2">{item}</span>
                                    ))}
                                <p className="mt-3">
                                    <strong>Field of Interest:</strong>{" "}{account.fieldOfInterest}
                                </p>
                                <p>
                                    <strong>Location:</strong> {account.location}
                                </p>
                                <div className="mb-3">
                                    <strong>Tech Stack: </strong>
                                    {account.techStack && account.techStack.map((item, index) => (
                                        <span key={index} className="badge bg-primary me-2">{item}</span>
                                    ))}
                                </div>
                                <p>
                                    <strong>Email:</strong> {account.email}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
}

export default LandingPage
