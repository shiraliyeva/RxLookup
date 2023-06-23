import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar.js';

function Home() {
  
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
      <div className='HomePage'>
      <div><NavBar /></div>
      <div className='MiddleContainer'>
        <div className='box SearchBar'>
          <Box sx={{ 
            margin: 'auto', 
            }}>
          <form onSubmit={handleSubmit}>
            <TextField
            label="Search for a drug..."
            value={searchValue}
            onChange={handleChange}
            variant="outlined"
            sx={{
              backgroundColor: '#f0f0f0',
              borderRadius: '10px',
              width: '80vw',
            }}
            InputLabelProps={{
              style: { fontFamily: 'Inconsolata'}
            }}
            InputProps={{
              endAdornment: <SearchIcon />,
              style: { fontFamily: 'Inconsolata'}
            }}
            />
          </form>
          </Box>
        </div>
        <div className='box ExampleBar'>
            <p>Trending Searches: 
                <span> </span>
                <Link to='/Results' state={{search: 'ozempic'}} className='search-link'>Ozempic (Semaglutide Injection),</Link>
                <span> </span>
                <Link to='/Results' state={{search: 'wegovy'}} className='search-link'>Wegovy (Semaglutide Injection),</Link>
                <span> </span>
                <Link to='/Results' state={{search: 'lexapro'}} className='search-link'>Lexapro (Escitalopram Oxalate)</Link>
            </p>
        </div>
      </div>
      </div>
      </>
    );
  }

export default Home;