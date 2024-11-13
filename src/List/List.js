import React, { useCallback, useEffect, useState } from 'react'
import Form from '../Form/Form';

const JSONDATA = [
    {id:1,userName:"abc"},
    {id:2,userName:"abc1"},
]


export function useLocalStorage(){

    function getLocalStorage(key){
        let list =  localStorage.getItem(key);
        let listData = JSON.parse(list);
        return  listData;
    }

    function setLocalStorage(key,value){
        localStorage.setItem(key,JSON.stringify(value));
    }

    return { getLocalStorage,setLocalStorage }

}

function List() {
    
    const localStorageHook = useLocalStorage();
    
    const [list,setList] = useState([]);
    const [listDummy,setListDummy] = useState([]);
    
    const [selectedData,setSelectedData] = useState(null);
    
    const handleEdit = (item)=>{
        setSelectedData(item);
    }

    useEffect(() => {
        let array = localStorageHook.getLocalStorage('DATA');
        console.log("hi");
        if(array?.length > 0){
            localStorageHook.setLocalStorage('DATA',array);
        } else {
            localStorageHook.setLocalStorage('DATA',JSONDATA);
        }
        setList(array?.length == 0 ? JSONDATA : array);
        setListDummy(array?.length == 0 ? JSONDATA : array);
    }, [])
    
    
    const handleSearch = (event) => {
        const value = event.target.value;
        let dummyList = JSON.parse(JSON.stringify(list));
        if(value){
            setListDummy(dummyList.filter(obj=>obj.userName.includes(value)));
        } else {
            setListDummy(dummyList);
        }
    }
    
    const handleSubmit = (item,action)=>{
        let previousData = localStorageHook.getLocalStorage('DATA');
        
        if(action == 'create'){
            item.id = list.length+1;
            previousData.push(item);
        } else {
            let existedIndex = previousData.findIndex(obj=>obj.id == item.id);
            previousData[existedIndex] = item;
        }
        localStorageHook.setLocalStorage('DATA',previousData);
        setList([...previousData]);
        setListDummy([...previousData]);
        setSelectedData(null);        
    }   
    
    
    return (
        <div>
        <input type='text' onKeyDown={handleSearch} placeholder='search'/>
        {
            listDummy?.length>0 && listDummy.map(obj=>(
                <React.Fragment key={obj.id}>
                <div style={{display:'flex'}}>
                <p>Name:{obj.userName}</p>
                <button onClick={()=>handleEdit(obj)}>Edit</button>
                </div>
                </React.Fragment>
            ))
        }
        
        <Form selectedData={selectedData} handleSubmit={handleSubmit} list={list}/>
        
        </div>
    )
}

export default List
