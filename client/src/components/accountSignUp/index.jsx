import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Navigate, useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app'
import "firebase/compat/storage"

const AccountSignUp=()=>{
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [location,setLocation]=useState('')
    const [github,setGithub]=useState('')
    const [linkedIn,setLinkedIn]=useState('')
    const [website,setWebsite]=useState('')
    const [twitter,setTwitter]=useState('')
    const [fieldOfInterest,setFieldOfInterest]=useState('')
    const [seeking,setSeeking]=useState([])
    const [techStack,setTechStack]=useState([])
    const [bio,setBio]=useState('')
    const [image,setImage]=useState('')
    const [redirect,setRedirect]=useState(false)
    const [loading,setLoading]=useState(false)
    const {id}=useParams()
    
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const data={
            name,
            email,
            password,
            location,
            github,
            twitter,
            website,
            linkedIn,
            fieldOfInterest,
            seeking,
            techStack,
            bio,
            image
        }
        try {
            if(id){
                const response=await axios.put(`/updateAccount/${id}`,data)
                console.log(response)
                if(response.status===200){
                    setRedirect(true)
                }
            }
            const response=await axios.post('/accountSignUp',data)
            console.log(response)
            if(response.status===200){
                setRedirect(true)
            }
        } catch (error) {
            console.log("Error posting student info to the server",error)
        }
    }

    const userInfo=async()=>{
        try {
            const response=await axios.get('/user')
            const data=response.data
            setName(data.name)
            setEmail(data.email)
            setLocation(data.location)
            setGithub(data.githubURL)
            setLinkedIn(data.linkedInURL)
            setBio(data.bio)
            setTwitter(data.twitterURL)
            setWebsite(data.websiteURL)
            setSeeking(data.seeking)
            setFieldOfInterest(data.fieldOfInterest)
            setTechStack(data.techStack)
        } catch (error) {
            console.log("Error fetching user info",error)
        }
    }

    const isStrongPassword=(password)=>{
        const hasLowercase=/[a-z]/.test(password)
        const hasUppercase=/[A-Z]/.test(password)
        const hasDigit=/\d/.test(password)
        const hasSpecialChar=/[!@#$%^&*()-+]/.test(password)
        const hasMinLength=password.length >= 8
        return hasLowercase && hasUppercase && hasDigit && hasSpecialChar && hasMinLength
    }

    const uploadPhoto=async(e)=>{
        const selectedFile=e.target.files[0]
        if(selectedFile){
            setLoading(true)
            const storageRef=firebase.storage().ref();
            const fileRef=storageRef.child(selectedFile.name);
            try{
                const snapshot=await fileRef.put(selectedFile)
                const downloadURL=await snapshot.ref.getDownloadURL()
                setImage(downloadURL)
            } catch (error) {
                console.error('Error uploading image:',error)
            } finally {
                setLoading(false)
            }
        } else {
            console.log('No file selected')
        }
    }
    

    useEffect(()=>{
        if(id){
            userInfo()
        }
    },[id])

    if(redirect){
        return(
            <Navigate to='/'/>
        )
    }

    return(
        <div className="container mt-5">
            <h1 className="mb-4 text-center">{id ? 'Update Account Info' : 'Academy Student Sign Up'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} value={name} />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>

                <div class="mb-3">
                    <span>Image: </span><input type="file" accept="image/*" onChange={uploadPhoto}/>
                    {loading ? (
                        <div className="mt-3 spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        ) : ( 
                            image && (
                            <img src={image} alt="Uploaded" className="img-fluid rounded mt-3" style={{ maxWidth: '150px', height: 'auto', display: 'block' }} />
                        )
                    )}
                </div>

                {!id &&
                    <>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className={`form-control ${password && !isStrongPassword(password) ? 'is-invalid' : ''}`} id="password" placeholder="Create a password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        <div className="invalid-feedback">
                            Password must meet the following criteria:
                            <ul>
                                <li>At least one lowercase English character.</li>
                                <li>At least one uppercase English character.</li>
                                <li>At least one special character. The special characters are: !@#$%^&*()-+</li>
                                <li>Length of at least 8 characters.</li>
                                <li>At least one digit.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" className={`form-control ${confirmPassword !== password ? 'is-invalid' : ''}`}placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        <div className="invalid-feedback">
                            Passwords do not match. Please enter matching passwords.
                        </div>
                    </div>
                    </>
                }

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location</label>
                    <input type="text" className="form-control" id="location" placeholder="Enter your location" onChange={(e) => setLocation(e.target.value)} value={location} />
                </div>

                <div class="mb-3">
                    <input type="url" class="form-control" placeholder="Enter your GitHub account URL" onChange={(e)=>setGithub(e.target.value)} value={github}/>
                </div>

                <div class="mb-3">
                    <input type="url" class="form-control" placeholder="Enter your LinkedIn profile URL" onChange={(e)=>setLinkedIn(e.target.value)} value={linkedIn}/>
                </div>

                <div class="mb-3">
                    <input type="url" class="form-control" placeholder="Enter your website URL" onChange={(e)=>setWebsite(e.target.value)} value={website}/>
                </div>

                <div class="mb-3">
                    <input type="url" class="form-control" placeholder="Enter your Twitter URL" onChange={(e)=>setTwitter(e.target.value)} value={twitter}/>
                </div>

                <div class="mb-3">
                    <textarea class="form-control" rows="4" placeholder="Bio" onChange={(e)=>setBio(e.target.value)} value={bio}></textarea>
                </div>

                <div class="mb-3">
                    <select class="form-select" onChange={(e)=>setFieldOfInterest(e.target.value)} value={fieldOfInterest}>
                        <option>Choose....</option>
                        <option>Security</option>
                        <option>IT</option>
                    </select>
                </div>

                <div class="mb-3">
                    <textarea class="form-control" rows="5" placeholder="Seeking (comma-separated values)" onChange={(e) => setSeeking(e.target.value.split(','))} value={seeking.join(',')}></textarea>
                </div>

                <div class="mb-3">
                    <textarea class="form-control" rows="5" placeholder="TechStack (comma-separated values)" onChange={(e) => setTechStack(e.target.value.split(','))} value={techStack.join(',')}></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>

    )
}

export default AccountSignUp
