import { useState, useEffect } from 'react'
import './App.css'
import ArtInfo from '../Components/ArtInfo';

function App() {
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getAllArt = async () => {
        const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=6");
        const json = await response.json();
        const ids = json.objectIDs; //array of ids corresponding to different works of asian art
        let arr = []; //going to put all the art info into this array first so it happens synchronously
        for (let i = 0; i < 100 && i*40-i < ids.length; i++) {
            const artResponse = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects/" + ids[i*40-i]);
            const art = await artResponse.json();
            if(art.primaryImageSmall != "" && art.artistDisplayName != "") {
                let a = {id: art.objectID, image: art.primaryImageSmall, title: art.title, culture: art.culture, artist: art.artistDisplayName, medium: art.medium};
                console.log(a);
                arr.push(a);
            }
        }
        setList([...list, ...arr]); //then put the array arr into the state list so it happens all at
    }
    getAllArt().then(console.log(list)).catch(console.error);
  }, []);

  const searchItems = (inputString) => {
    setSearchQuery(inputString);
    if(searchQuery != "") {
        const filtered = list.filter((item) => 
            Object.values(item)
              .join("")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        ); //converts the value into all one big lower case string and sees if searchValue is in it
        //if it's present in the string then it is included in filtered
        setFilteredResults(filtered);
    }
    else {
        setFilteredResults(list);
    }

  };

  return (
    <div className='whole-page'>
        <h1>Asian Art in the Metropolitan Museum of Art</h1>
        <h3>Search by title, artist, medium, or culture:</h3>
        <input type='text' placeholder='Search...' onChange={(inputString) => searchItems(inputString.target.value)}></input>
        <h3>Filter by medium:</h3>
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Medium</th>
                    <th>Culture</th>
                </tr>
            </thead>
            <tbody>
                {searchQuery.length > 0 ? 
                    filteredResults.map((art, index) => (
                        <ArtInfo key={art.id} image={art.image} title={art.title} artist={art.artist} medium={art.medium} culture={art.culture}></ArtInfo>    
                        ))
                : 
                    list ? list.map((art, index) => (
                        <ArtInfo key={art.id} image={art.image} title={art.title} artist={art.artist} medium={art.medium} culture={art.culture}></ArtInfo>    
                        ))
                    : null
                }  
                
            </tbody>
        </table>
    </div>
  )
}

export default App
