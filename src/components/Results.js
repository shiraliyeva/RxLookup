import React, { useEffect, useState } from "react";
import { useLocation }from 'react-router-dom';
import '../App.css';
import NavBar from "./NavBar.js";
import Box from '@mui/material/Box';
import {TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { Configuration, OpenAIApi } from "openai";
import ChatGPTLogo from '../ChatGPTLogo.png';

function Results() {
    const location = useLocation();
    
    // 1. fetch from rxNorm API
    // 2. store the response
    // 3. output to interface

    const [interactionInfo, setInteractionInfo] = useState([]);
    // const [rxcui, setRxcui] = useState('')
    const [drugClass, setDrugClass] = useState('')
    const [genericName, setGenericName] = useState('')
    const [brandNames, setBrandName] = useState([])
    const [chatGPTResponse, setChatGPTResponse] = useState('');
    var userInput = location.state.search.toLowerCase()
    // var drugName = userInput.charAt(0).toUpperCase() + userInput.slice(1)
    var drugName = userInput.toUpperCase()
    const [isDrugNameValid, setIsDrugNameValid] = useState(false)
    const [searchValue, setSearchValue] = useState("");
    const [loadingGPT, setLoadingGPT] = useState(true);
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
     
   
    useEffect(() => {

        const handleOpenAICall = () => {
            setLoadingGPT(true);
            const openai = new OpenAIApi(new Configuration({
              apiKey: process.env.REACT_APP_OPENAI_API_KEY,
            }));
        
            const headers = {
                'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
              };
            
              const requestData = {
                model: "gpt-3.5-turbo",
                messages: [
                  {
                    role: 'user',
                    content: `give me a short purpose of ${userInput.charAt(0).toUpperCase() + userInput.slice(1)} (100 words) its most common side effects, also tell me which side effects require me to consult a doctor, and who should not use this medication.`
                  }
                ]
              };
            
              openai.createChatCompletion(requestData, headers)
                .then(res => {
                  const response = res.data.choices[0].message.content;
                  setLoadingGPT(false);
                  setChatGPTResponse(response);
                }).catch(error => {
                    console.error('Error occurred while making OpenAI API request:', error);
                });
            // openai.createChatCompletion({
            //   model: "gpt-3.5-turbo",
            //   messages: [
            //     {
            //       role: 'user',
            //       content: `give me a short purpose of ${userInput.charAt(0).toUpperCase() + userInput.slice(1)} (100 words) its most common side effects, also tell me which side effects require me to consult a doctor, and who should not use this medication.`
            //     }
            //   ]
            // }).then(res => {
            //   const response = res.data.choices[0].message.content;
            //   setLoadingGPT(false);
            //   setChatGPTResponse(response);
            // });
        };

        setSearchValue("");

        const fetchItem = async () => {
            let data = await fetch('https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=BN')
            .then(response => response.json())
            .then(data => data)
            .catch(err => console.error(err));

            let genericData = await fetch('https://rxnav.nlm.nih.gov/REST/allconcepts.json?tty=IN')
            .then(response => response.json())
            .then(genericData => genericData)
            
            let interactionData;
            let rxcui;
            let genericName;
            let brandNames = [];
            let brandNameData;
            let enclosedBrandName;
            var isValidInput = false;
            
            for (let i = 0; i < data.minConceptGroup.minConcept.length; i++) {
           
                if (userInput === data.minConceptGroup.minConcept[i].name.toLowerCase()) {
                    rxcui = data.minConceptGroup.minConcept[i].rxcui
                    console.log(`Found brand drug ${location.state.search} at position ${i}, rxcui ${rxcui}`);   
                    interactionData = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${data.minConceptGroup.minConcept[i].rxcui}&sources=DrugBank`)
                    .then(response => response.json())
                    .then(interactionData => interactionData)
                    brandNames.push(data.minConceptGroup.minConcept[i].name)
                    genericName = interactionData.interactionTypeGroup[0].interactionType[0].interactionPair[0].interactionConcept[0].minConceptItem.name
                    isValidInput = true
                    break;
                }
            }

            for (let i = 0; i < genericData.minConceptGroup.minConcept.length; i++) {

                if (userInput === genericData.minConceptGroup.minConcept[i].name.toLowerCase()) {
                    rxcui = genericData.minConceptGroup.minConcept[i].rxcui
                    console.log(`Found generic drug ${location.state.search} at position ${i}, rxcui ${rxcui}`);   
                    interactionData = await fetch(`https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=${genericData.minConceptGroup.minConcept[i].rxcui}&sources=DrugBank`)
                    .then(response => response.json())
                    .then(interactionData => interactionData)
                    genericName = genericData.minConceptGroup.minConcept[i].name

                    brandNameData = await fetch(`https://rxnav.nlm.nih.gov/REST/Prescribe/rxcui/${rxcui}/related.json?tty=SBD`)
                    .then(response => response.json())
                    .then(brandNameData => brandNameData)

                    if (brandNameData.relatedGroup.conceptGroup[0].conceptProperties) {

                        for (let j = 0; j < brandNameData.relatedGroup.conceptGroup[0].conceptProperties.length; j++) {
                            enclosedBrandName = brandNameData.relatedGroup.conceptGroup[0].conceptProperties[j].name

                            // Finding the starting and ending indexes of the square brackets
                            var startIndex = enclosedBrandName.indexOf("[");
                            var endIndex = enclosedBrandName.indexOf("]");

                            // Extracting the content inside the square brackets
                            var extractedBrandName = enclosedBrandName.substring(startIndex + 1, endIndex);


                            console.log(extractedBrandName)
                            
                            if (!brandNames.includes(extractedBrandName)) {
                                brandNames.push(extractedBrandName)
                            }
                        }

                    } else {

                        brandNames.push(genericName)
                    }

                    isValidInput = true
                    break;
                }

                
                // console.log(data.minConceptGroup.minConcept[i].name);
            }

            if (isValidInput === false) {

                navigate('/Error');
                return null;


            } else {

                let interactionPair = interactionData.interactionTypeGroup[0].interactionType[0].interactionPair;
                const interactionArray = [];
                for (let i = 0; i < interactionPair.length; i++) {
                    interactionArray.push({
                        name: interactionPair[i].interactionConcept[1].sourceConceptItem.name,
                        description: interactionPair[i].description
                    });
                }

                setInteractionInfo(interactionArray)
                // setRxcui(rxcui)
                setGenericName(genericName)
                setBrandName(brandNames)
                
                let classData = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=ATC`)
                .then(response => response.json())
                .then(classData => classData)

                if (Object.keys(classData).length === 0) {

                    let classData = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=MESH`)
                    .then(response => response.json())
                    .then(classData => classData)

                    if (Object.keys(classData).length === 0) {

                        setDrugClass('N/A')

                    } else {
                            
                        let drugClass = classData.rxclassDrugInfoList.rxclassDrugInfo[0].rxclassMinConceptItem.className;
                        setDrugClass(drugClass)
                    }

                } else {
                
                    let drugClass = classData.rxclassDrugInfoList.rxclassDrugInfo[0].rxclassMinConceptItem.className;
                    setDrugClass(drugClass)

                }
                setIsDrugNameValid(true)
            }
            // [
            //     {
            //         interactionName: String,
            //         interactionDescription: String,
            //     }
            // ]

        }
        fetchItem();
        handleOpenAICall();
     
    },[location]);

    useEffect(() => {

    },[location])

    return(
        <>
        <div className="ResultsPage">
        <div>
            <NavBar />
        </div>
        {isDrugNameValid === false ? <></> : 
        <div className="ResultsContainers">
        <div className='LeftContainer'>
            <div className='box DrugName'><h1>{drugName}</h1></div>
            <div className="box GenBrandClass">
                <p>Generic Name: {genericName}</p>
                <p>Brand Name(s): {brandNames.join(', ')}</p>
                <p>Drug Class: {drugClass}</p>
            </div>
            <div className="box SideEffects">
                <div className="box SideEffectsTitle">
                Drug Description & Side Effects:
                </div>
                <div className="box SideEffectsDescription">
                    {loadingGPT ? 
                    (<div className="loading-container">
                        <div className="loading-container logo"><img src={ChatGPTLogo} alt="ChatGPT Logo" className="logo" /></div>
                        <div className="loading-container message">Loading ChatGPT response...</div>
                    </div>) : (
                        <p> {chatGPTResponse}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="RightContainer">
            <div className="box smallSearchBar">
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
            <div className="box InteractionsTitle">{userInput.charAt(0).toUpperCase() + userInput.slice(1)} Drug Interactions:</div>
            <div className="box Interactions">{interactionInfo.map((interaction) =>  {
                return <>
                <p>{interaction.name}: {interaction.description}</p>
                </>
            })}    
            </div>
        </div>
        </div>  
        }
        </div>
        </>
    );
}

export default Results;


