import React, { useEffect, useState } from 'react'

function Form(props) {
    
    const {selectedData,handleSubmit } = props;
    
    const initialState = {
        id:0,
        userName:''
    }
    
    const [form,setForm] = useState(initialState);
    
    useEffect(() => {
        console.log(selectedData);
        if(selectedData != null){
            setForm(selectedData);
        }
        
    }, [selectedData])
    
    function handleChange(event){
        setForm({
            ...form,
            [event.target.name]:event.target.value
        })
    }
    
    const handleSubmitFn= ()=>{
        if(form.userName == ''){
            return;
        }
        console.log(form,"form");
        if(selectedData != null){
            handleSubmit(form,'update');
        } else {
            handleSubmit(form,'create');
        }
        setTimeout(() => {
            setForm(initialState);
        }, 10);        
    }
    
    
    
    return (
        <div>
        
        <input type='text' name='userName' onInput={handleChange} value={form.userName} placeholder='Enter username'/>
        <button type='button' onClick={handleSubmitFn}>{selectedData == null ? 'save' : 'update'}</button>
        
        </div>
    )
}

export default Form
