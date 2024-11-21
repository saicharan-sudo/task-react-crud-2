import React, { useEffect, useState } from "react";
import Service from "../Common/Service/Service";
import { useForm } from "react-hook-form";
import useToaster from "../Common/Toaster/Toaster";

function SupplierForm(props) {
  const {
    register:registerForSupplier,
    handleSubmit:handleSubmitForSupplier,
    control:controlForSupplier,
    formState: { errors, isValid },
    setValue:setValueForSupplier,
    setError:setErrorForSupplier,
    clearErrors:clearErrorsForSupplier,
    getValues:getValuesForSupplier,
    watch:watchForSupplier,
    setFocus:setFocusForSupplier,
    reset:resetForSupplier,
  } = useForm();

  const apiService = Service();

  const [countryList, setCountryList] = useState([]);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const toastrService = useToaster();

  // const [countrySelectedId,setCountrySelectedId] = useState('');
  // const [stateSelectedId,setstateSelectedId] = useState('');
  // const [countrySelectedId,setCountrySelectedId] = useState('');

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    if (props.selectedItemForEdit != null) {
      Object.entries(props.selectedItemForEdit.Supplier).forEach(
        ([name, value]) => setValueForSupplier(name, value)
      );
    }
  }, [props.selectedItemForEdit]);

  async function initialLoad() {
    await getCountries();
    await setValueForSupplier("countryId", "1", { shouldValidate: true });
    // console.log(countryList?.[0]?.countryId,"countryList?.[0]?.countryId");
    await getStates();
    await setValueForSupplier("stateId", "1", { shouldValidate: true });
    // console.log(stateList?.[0]?.stateId);
    await getCities();
  }

  function getCountries() {
    return new Promise((resolve, reject) => {
      apiService
        .getCountries()
        .then((res) => {
          // console.log(res);
          setCountryList(res.data.data.countyList);

          setValueForSupplier("stateId", "");
          setStateList([]);

          setValueForSupplier("cityId", "");
          setCityList([]);
          resolve({});
        })
        .catch((error) => {
          toastrService.showErrorMessage(error.message);
        });
    });
  }

  function getStates() {
    return new Promise((resolve, reject) => {
      const getData = getValuesForSupplier();
      apiService
        .getStates(getData.countryId)
        .then((res) => {
          setStateList(res.data.data.stateList);
          setValueForSupplier("cityId", "");
          setCityList([]);
          resolve({});
        })
        .catch((error) => {
          toastrService.showErrorMessage(error.message);
        });
    });
  }

  function getCities() {
    return new Promise((resolve, reject) => {
      const getData = getValuesForSupplier();
      apiService
        .getCities(getData.countryId, getData.stateId)
        .then((res) => {
          setCityList(res.data.data.cityList);
          resolve({});
        })
        .catch((error) => {
          toastrService.showErrorMessage(error.message);
        });
    });
  }

  function handleChage() {
    const data = getValuesForSupplier();
    let timerId = null;
    // return  (...args)=>{
    //   clearInterval(timerId);
    // timerId = setInterval(()=>{
    props.handleChangeEventOFSupplierForm(data);
    // },1000)
    // }
  }

  const onSubmit = () => {
    const data = getValuesForSupplier();
    props.handleChangeEventOFSupplierForm(data, isValid);
  };
  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmitForSupplier(onSubmit)}>
        <div className="row">
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="text" className="form-label">
                Supplier Name:
              </label>
              <input
                type="text"
                className="form-control"
                {...registerForSupplier("supplierName", { required: true })}
                id="supplierName"
                placeholder="Enter"
                name="supplierName"
                onChange={handleChage}
              />
              {errors?.supplierName?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="companyName" className="form-label">
                Company Name:
              </label>
              <input
                type="text"
                className="form-control"
                {...registerForSupplier("companyName", { required: true })}
                id="companyName"
                placeholder="Enter"
                name="companyName"
                onChange={handleChage}
              />
              {errors?.companyName?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="pwd" className="form-label">
                Country:
              </label>

              <select
                className="form-select"
                {...registerForSupplier("countryId", { required: true })}
                onChange={() => {
                  getStates();
                  handleChage();
                }}
              >
                {/* <option value={1}>USD</option>
      <option value={2}>INR</option> */}
                <option value={""}>select</option>
                {countryList?.length > 0 &&
                  countryList?.map((obj, index) => (
                    <option
                      key={obj?.countryId}
                      value={obj?.countryId}
                    >{`${obj?.currency} (${obj?.name})`}</option>
                  ))}
              </select>
              {errors?.countryId?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="pwd" className="form-label">
                State:
              </label>

              <select
                className="form-select"
                {...registerForSupplier("stateId", { required: true })}
                onChange={() => {
                  getCities();
                  handleChage();
                }}
              >
                <option value={""}>select</option>
                {stateList?.length > 0 &&
                  stateList?.map((obj, index) => (
                    <option
                      key={obj?.stateId}
                      value={obj?.stateId}
                    >{`${obj?.name}`}</option>
                  ))}
              </select>
              {errors?.stateId?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="pwd" className="form-label">
                City:
              </label>

              <select
                className="form-select"
                {...registerForSupplier("cityId", { required: true })}
                onChange={handleChage}
              >
                {/* <option value={1}>Florida</option>
        <option value={2}>Kurnool</option>
        <option value={3}>Hyderabad</option> */}
                <option value={""}>select</option>
                {cityList?.length > 0 &&
                  cityList?.map((obj, index) => (
                    <option
                      key={obj?.cityId}
                      value={obj?.cityId}
                    >{`${obj?.name}`}</option>
                  ))}
              </select>
              {errors?.cityId?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="email" className="form-label">
                Email Address:
              </label>
              <input
                type="email"
                {...registerForSupplier("email", { required: true })}
                className="form-control"
                id="pwd"
                placeholder="Enter"
                name="email"
                onChange={handleChage}
              />
              {errors?.email?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6 my-2">
            <div className="">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number:
              </label>
              <input
                type="text"
                {...registerForSupplier("phoneNumber", { required: true })}
                className="form-control"
                id="pwd"
                placeholder="Enter"
                name="phoneNumber"
                onChange={handleChage}
              />
              {errors?.phoneNumber?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
        </div>
        {/* {!isValid &&  */}
        <div className="w-100 text-center my-2">
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        </div>
        {/* // } */}
      </form>
    </div>
  );
}

export default SupplierForm;
