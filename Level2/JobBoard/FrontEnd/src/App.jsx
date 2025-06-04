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
  const [jobData, setJobData] = useState({
    tota_applns: "",
    tot_jobs: "",
    tot_condidate: "",
    tot_company :"",
    success_rate: "" 
  })
  const [boolLogin, setBoolLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Routes><Route path='/' element={<Home />}/></Routes>;
      case 'joblist':
        return <Routes><Route path='/job-list' element={<JobList setCurrentPage={setCurrentPage} />}/></Routes>;
      case 'job':
        return <Routes><Route path='/job' element={<Job setCurrentPage={setCurrentPage} />}/></Routes>;
      case 'employee':
        return <Routes><Route path='/employee' element={<EmployeeDashboard />}/></Routes>;
      case 'candidate':
        return <Routes><Route path='/candidate' element={<CandidateDashboard />}/></Routes>;
      default:
        return <Routes><Route path='/' element={<Home />}/></Routes>;
    }
  };

  return (
    <>
    <BrowserRouter>
      {boolLogin ? 
        <Routes>
          <Route path='/login' element={<Login boolLogin={boolLogin} setBoolLogin={setBoolLogin} setUser={setUser} />}/>
        </Routes>
        :
        <>
          <Navbar setCurrentPage={setCurrentPage} setBoolLogin={setBoolLogin} user={user} setUser={setUser} />
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