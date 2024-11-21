import axios from 'axios'
import React from 'react'


const BASEURL = "https://apis-technical-test.conqt.com/Api/"

function Service() {
  
  
  function getData(){
    return axios.get( BASEURL + "Item-Supplier/Get-All-Items");
  }
  
  function saveForm(payload){
    return axios.post(BASEURL + "Item-Supplier/Save-Items-Suppliers",payload)
  }
  
  function getCountries(){
    return axios.get(BASEURL + "countrystatecity/Get-All-CountryList")
  }
  
  function getStates(countryId){
    return axios.get(BASEURL + `countrystatecity/Get-All-SateList-By-Country?countryId=${countryId}`)
  }
  
  function getCities(countryId,stateId){
    return axios.get(BASEURL + `countrystatecity/Get-All-CityList-By-Country-State?countryId=${countryId}&stateId=${stateId}`)
  }
  
  
  function updateData(itemId,supplierId,data){
    return axios.post(BASEURL + `Item-Supplier/Update-Items-Details/${itemId}/${supplierId}`,data)
  }
  
  
  
  return {
    getData,
    saveForm,
    getCountries,
    getStates,
    getCities,
    updateData
  }
}

export default Service
