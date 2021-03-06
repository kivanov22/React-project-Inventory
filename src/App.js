import './App.css';
import Searchbar from './SearchBar.js';
import AddItem from './AddItem.js';
import { useState, useEffect } from 'react';
import ItemsDisplay from './ItemsDisplay.js';

function App() {

  const [filters, setFilters] = useState({});
  const [data, setData] = useState({ items: [] });

  useEffect(() => {//run one time when we start page
    fetch("http://localhost:3000/items")
      .then((response) => response.json())
      .then((data) => setData({ items: data }));
  }, [])

  const updateFitlers = (searchParams) => {
    setFilters(searchParams);
  };

  const deleteItem = (item) => {
    const items = data["items"];
    const requestOptions = {
      method: "DELETE"
    }
    fetch(`http://localhost:3000/items/${item.id}`, requestOptions).then((response)=>{
      if(response.ok){
        const idx = items.indexOf(item);
        items.splice(idx,1);
        setData({items:items});
      }
    })
  }

  const addItemToData = (item) => {
    let items = data["items"];

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };

    fetch("http://localhost:3000/items", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        items.push(data);
        setData({ items: items });
      });//default GET


  };

  const filterData = (data) => {
    const filteredData = [];

    if (!filters.name) {
      return data;
    }
    for (const item of data) {

      //check for default value
      if (filters.name !== '' && item.name !== filters.name) {
        continue;//skip item
      }

      if (filters.price !== 0 && item.price > filters.price) {
        continue;
      }

      if (filters.type !== '' && item.type !== filters.type) {
        continue;
      }
      if (filters.brand !== '' && item.brand !== filters.brand) {
        continue;
      }
      filteredData.push(item);
    }
    return filteredData;
  }

  return (
    <div className="container">
      <div className="row mt-3">
        <ItemsDisplay deleteItem={deleteItem} items={filterData(data["items"])} />
      </div>
      <div className="row mt-3">
        <Searchbar updateSearchParams={updateFitlers}></Searchbar>
      </div>
      <div className="row mt-3">
        <AddItem addItem={addItemToData} />
      </div>
    </div>
  );
}


export default App;
