import React, { useState } from 'react'
import '../src/components/App.css'
import CandidateDashboard from './components/CandidateDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import Footer from './components/Footer'
import Home from './components/Home'
import Job from './components/Job'
import JobList from './components/JobList'
import Login from './components/Login'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const url = 'http://localhost:8000';
  const [jobId, setJobId] = useState(null);
  const [jobData, setJobData] = useState({
      title: "",
      company: "",
      location: "",
      salary: "",
      type: "",
      posted: "",
      description: ``,
      responsibilities: [],
      requirements: [],
      skills: [],
      benefits: [],
      duration: "",
      contact: ""
    });
  const [boolLogin, setBoolLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loginState, setLoginState] = useState(false);
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Routes><Route path='/' element={<Home />}/></Routes>;
      case 'joblist':
        return <Routes><Route path='/job-list' element={<JobList setCurrentPage={setCurrentPage} setJobData={setJobData} jobId={jobId} setJobId={setJobId} url={url}/>}/></Routes>;
      case 'job':
        return <Routes><Route path={`/job/${jobId}`} element={<Job setCurrentPage={setCurrentPage} jobId={jobId} jobData={jobData} url={url} user={user}/>}/></Routes>;
      case 'employee':
        return <Routes><Route path='/employee' element={<EmployeeDashboard url={url} user={user}/>}/></Routes>;
      case 'candidate':
        return <Routes><Route path='/candidate' element={<CandidateDashboard url={url} user={user}/>}/></Routes>;
      default:
        return <Routes><Route path='/' element={<Home/>}/></Routes>;
    }
  };

  return (
    <>
    <BrowserRouter>
      {boolLogin ? 
        <Routes>
          <Route path='/login' element={<Login boolLogin={boolLogin} setBoolLogin={setBoolLogin} setUser={setUser} setCurrentPage={setCurrentPage} setLoginState={setLoginState} url={url}/>}/>
        </Routes>
        :
        <>
          <Navbar setCurrentPage={setCurrentPage} boolLogin={boolLogin}  setBoolLogin={setBoolLogin} user={user} setUser={setUser} loginState={loginState} />
          <div className="app">
            {renderPage()}
          </div>
          <Footer setCurrentPage={setCurrentPage} />
        </>
      }
    </BrowserRouter>
    </>
  )
}

export default App