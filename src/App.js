import { useState, useEffect } from 'react';
import { NFTStorage, File } from 'nft.storage'
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import axios from 'axios';
//import "./index.css";
//import config from "./config.json";

// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';

// ABIs
import NFT from './abis/NFT.json'

// Config
import config from './config.json';
import { getSystemErrorName } from 'util';

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription]= useState("")
  const [image, setImage] = useState(null)

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  }

  const submitHandler= async (e)=>{
    e.preventDefault()
    // call AI API to create image .
    const imageData = createImage();
  }

  const createImage = async() =>{
    console.log("creating image..")

    const URL = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4' //'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5' 
    const response = await axios({
      url: URL ,
      method: 'POST',
      headers: {
        Authorisation: 'Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        inputs: description, 
        options: { wait_for_model: true},
      }),
      responseType: 'arraybuffer',
    })

    const type= response.headers['Content-Type']
    const data = response.data

    const base64data = Buffer.from(data).toString('base64')
    const img= 'data: ${type}; base64,' + base64data //to render it on page 
    setImage(img)

    return data
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <div className="form">
        <form onSubmit={submitHandler}>
          <input type="text" placeholder='The item name..' onChange={(e) => {setName(e.target.value)}}></input>
          <input type="text" placeholder='The item description..' onChange={(e) => {setDescription(e.target.value)}}></input>
          <input type="submit" value="create and Mint"></input>
        </form>
        <div className='image'>
        <img src= {image} alt='AI generated image'></img>
        </div>
      </div>
      
      <p>View &nbsp:<a href='' target="_blank" rel="noreferrer">Metadata</a></p>

    </div>
  );
}

export default App;
