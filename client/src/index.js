import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from 'firebase/compat/app'

const firebaseConfig = {
  apiKey: "AIzaSyCPSrr7QqlhLUfPXZh3cuTS8XzkGLSQefk",
  authDomain: "bytive-imagedata.firebaseapp.com",
  projectId: "bytive-imagedata",
  storageBucket: "bytive-imagedata.appspot.com",
  messagingSenderId: "817428628924",
  appId: "1:817428628924:web:1436c94338aa45e81a97b9",
  measurementId: "G-49BPEWTTMV"
}

firebase.initializeApp(firebaseConfig)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
