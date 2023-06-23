import React, { useEffect, useState } from "react";
import '../App.css';
import NavBar from "./NavBar.js";
import Box from '@mui/material/Box';
import {TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function ErrorPage() {

    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = (event) => {
      event.preventDefault();
      navigate('/Results', { state: {
        search: searchValue
      }})
    };

    const handleChange = (event) => {
      setSearchValue(event.target.value);
    };
  
    useEffect(()=> {
      console.log(searchValue)
    }, [searchValue])

    return (
        <>
        <div className="ErrorPage">
        <div>
            <NavBar />
        </div>
        <div className="errorMessage">
            <h2>ERROR</h2>
            <p>Sorry, the requested drug information is not available or is not a valid drug.</p>
            <p>Please make sure you entered a valid drug name and try again.</p>
        </div>
        <div className="box errorSearchBar">
            <Box>
            <form onSubmit={handleSubmit}>
                <TextField
                label="Search for another drug..."
                value={searchValue}
                onChange={handleChange}
                variant="outlined"
                sx={{
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                width: '100%',
                }}
                InputProps={{
                endAdornment: <SearchIcon />,
                }}
                />
            </form>
            </Box>
        </div>
        </div>
        </>
    )
}

export default ErrorPage;