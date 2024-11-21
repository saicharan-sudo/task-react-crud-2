import React, { useEffect, useState } from "react";
import NoRecordsFound from "../NoRecordsFound/NoRecordsFound";
import axios from "axios";
import Service from "../Common/Service/Service";
import useToaster from "../Common/Toaster/Toaster";
import ItemForm from "../Form/ItemForm";
import SupplierForm from "../Form/SupplierForm";
import { toast } from "react-toastify";
import Loader from "../Common/Loader/Loader";
import { useForm } from "react-hook-form";

function Header() {
  const [itemFormSelectedForItem, setItemFormSelectedForItem] = useState(false);
  const [itemFormSelectedForSupplier, setItemFormSelectedForSupplier] =
    useState(false);

  const [tableData, setTableData] = useState([]);
  const [tableDataDummy, setTableDataDummy] = useState([]);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const apiService = Service();

  const toastrService = useToaster();

  const [formData, setFormData] = useState(null);

  const [itemFormValid, setItemFormValid] = useState(false);

  const [supplierFormValid, setSupplierFormValid] = useState(false);

  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  const [countryList, setCountryList] = useState([]);

  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);


  // const { register:registerForForItemForm, handleSubmit:handleSubmitForItemForm, control:controlForItemForm, formState: { errors:errorsForItemForm, isValid:isValidForItemForm, }, setValue:setValueForItemForm, setError:setErrorForItemForm, clearErrors:clearErrorsForItemForm, getValues:getValuesForItemForm, watch:watchForItemForm, setFocus:setFocusForItemForm, reset:resetItemForm } = useForm();
  // const { register:registerForForSupplierForm, handleSubmit:handleSubmitForSupplierForm, control:controlForSupplierForm, formState: { errors:errorsForSupplierForm, isValid:isValidForSupplierForm, }, setValue:setValueForSupplierForm, setError:setErrorForSupplierForm, clearErrors:clearErrorsForSupplierForm, getValues:getValuesForSupplierForm, watch:watchForSupplierForm, setFocus:setFocusForSupplierForm, reset:resetSupplierForm } = useForm();

  const {
    register: registerForItemForm,
    handleSubmit: handleSubmitForItemForm,
    control: controlForItemForm,
    formState: { errors: errorsForItems, isValid: isValidForItems },
    setValue: setValueForItemForm,
    setError: setErrorForItemForm,
    clearErrors: clearEForItemFormrrors,
    getValues: getValuesForItemForm,
    watch: watchForItemForm,
    setFocus: setForItemFormFocus,
    reset: resetForItemForm,
  } = useForm();

  const {
    register: registerForSupplier,
    handleSubmit: handleSubmitForSupplier,
    control: controlForSupplier,
    formState: { errors: errorsForSupplier, isValid: isValidForSupplier },
    setValue: setValueForSupplier,
    setError: setErrorForSupplier,
    clearErrors: clearErrorsForSupplier,
    getValues: getValuesForSupplier,
    watch: watchForSupplier,
    setFocus: setFocusForSupplier,
    reset: resetForSupplier,
  } = useForm();


  useEffect(() => {
    initialLoad();
  }, []);


  function handleOnKeyDownOnlyNumber(e) {
    const key = e.key;
    if (
      !/^\d$/.test(key) &&
      key !== "Backspace" &&
      key !== "ArrowLeft" &&
      key !== "ArrowRight"
    ) {
      e.preventDefault();
    }
  }

  async function initialLoad() {
    getData();
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


  function getData() {
    setIsLoading(true);
    apiService
      .getData()
      .then((res) => {
        if (res?.data?.data?.items && res?.data?.data?.items?.length > 0)
          setTableData(res.data.data.items);
        setTableDataDummy(res.data.data.items);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toastrService.showErrorMessage(error.message);
      });
  }


  const onSubmitItemForm = () => {
    const data = getValuesForItemForm();
    console.log(data, 'itemForm');
    // props.handleChangeEventOFItemForm(data, isValid);
  };

  const onSubmitSupplierForm = () => {
    const data = getValuesForItemForm();
    console.log(data, 'itemForm');
    // props.handleChangeEventOFItemForm(data, isValid);
  };


  const handleSelectAll = async (e) => {
    let checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setTableDataDummy(
        tableDataDummy.map((obj) => {
          return { ...obj, checked: true };
        })
      );
      setSelectedItems(tableDataDummy.map((student) => student.itemId));
    } else {
      setTableDataDummy(
        tableDataDummy.map((obj) => {
          return { ...obj, checked: false };
        })
      );
      setSelectedItems([]);
    }
  };

  const handleCheckboxChange = async (e, employee) => {
    let checked = e.target.checked;
    let existedIndex = tableData.findIndex(
      (obj) => obj.itemId == employee.itemId
    );
    if (existedIndex != -1) {
      tableData[existedIndex].checked = checked;
    }
    employee.checked = checked;

    if (checked && !selectedItems.includes(employee?.itemId)) {
      await setSelectedItems([...selectedItems, employee?.itemId]);
    } else {
      await setSelectedItems(
        selectedItems.filter((name) => name != employee?.itemId)
      );
    }
    setSelectAll(isAllChecked(tableDataDummy));
  };

  function isAllChecked(array) {
    return array.every((obj) => obj.checked);
  }

  function handleChangeEventOFSupplierForm() {

    const getValues = getValuesForSupplier();
    setFormData({
      ...formData,
      supplier: getValues,
    });
    setSupplierFormValid(isValidForSupplier);
  }

  function handleChangeEventOFItemForm() {

    const getValues = getValuesForItemForm();
    setFormData({
      ...formData,
      itemDetails: getValues,
    });
    setItemFormValid(isValidForItems);
  }

  function handleChangeEventForItem(event) {
    let check = event.target.checked;
    setItemFormSelectedForItem(check);
    resetForItemForm();
    if (!check) {
      setFormData({
        ...formData,
        itemDetails: {},
      });
    }
  }

  function handleChangeEventForSupplier(event) {
    let check = event.target.checked;
    setItemFormSelectedForSupplier(check);
    resetForSupplier();
    if (!check) {
      setFormData({
        ...formData,
        supplier: {},
      });
    }
  }

  // useEffect(() => {
  //     console.log(formData);
  // }, [formData])

  function onSubmit() {
    if (!itemFormSelectedForItem || !itemFormSelectedForSupplier) {
      toastrService.showErrorMessage("Please enter the data in both the form");
      return;
    }

    if (itemFormSelectedForItem && !isValidForItems) {
      toastrService.showErrorMessage("please fill the item form completely");
      return;
    }
    if (itemFormSelectedForSupplier && !isValidForSupplier) {
      toastrService.showErrorMessage("please fill the supplier form completely");
      return;
    }

    let data = { ...formData };

    if (itemFormSelectedForItem) {
      data.itemDetails.currency = "$";
    }

    if (itemFormSelectedForSupplier) {
      data.supplier.phoneCode = "+91";
    }
    setIsLoading(true);

    if (
      !selectedItemForEdit?.itemId &&
      !selectedItemForEdit?.Supplier?.supplierId
    ) {
      saveData(data);
    } else {
      delete data.itemDetails.Supplier;
      updateData(
        selectedItemForEdit?.itemId,
        selectedItemForEdit?.Supplier?.supplierId,
        data
      );
    }
  }

  function saveData(data) {
    apiService
      .saveForm(data)
      .then((res) => {
        getData();
        setItemFormSelectedForItem(false);
        setItemFormSelectedForSupplier(false);
        setIsLoading(false);
        setSelectedItemForEdit(null);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        toastrService.showErrorMessage(error.response ? error.response.data.message : error.message);
      });
  }

  function updateData(itemId, supplierId, data) {
    apiService
      .updateData(itemId, supplierId, data)
      .then((res) => {
        getData();
        setItemFormSelectedForItem(false);
        setItemFormSelectedForSupplier(false);
        setIsLoading(false);
        setSelectedItemForEdit(null);
      })
      .catch((error) => {
        setIsLoading(false);
        toastrService.showErrorMessage(error.response.data.message ? error.response.data.message : error.message);
      });
  }

  function handleSelectedItemForEdit(item) {
    setSelectedItemForEdit(item);
    setItemFormSelectedForItem(true);
    setItemFormSelectedForSupplier(true);
    setTimeout(() => {

      if (item != null) {

        Object.entries(item?.Supplier).forEach(
          ([name, value]) => setValueForSupplier(name, value)
        );

        Object.entries(item).forEach(([name, value]) =>
          setValueForItemForm(name, value)
        );
        getCountries();
        getStates();
        getCities();

      }
    }, 500);
  }

  return (
    <>
      {isLoading && <Loader />}
      <nav className="navbar navbar-expand-md bg-dark navbar-dark">
        <a className="navbar-brand"></a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav ms-auto">
            {/* <li className="nav-item">
      <a className="nav-link" href="javascript:void(0)">Link</a>
      </li>
      <li className="nav-item">
      <a className="nav-link" href="javascript:void(0)">Link</a>
      </li> */}
            <li className="nav-item">
              <a className="nav-link ">Home</a>
            </li>
          </ul>
        </div>
      </nav>

      <form className="d-flex justify-content-center gap-2 my-3">
        <div className="custom-control custom-checkbox custom-control-inline">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customRadio"
            value={itemFormSelectedForItem}
            checked={itemFormSelectedForItem}
            onChange={handleChangeEventForItem}
          />
          <label className="custom-control-label ms-2" htmlFor="customRadio">
            Item
          </label>
        </div>
        <div className="custom-control custom-checkbox custom-control-inline">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customRadio2"
            name="example"
            onChange={handleChangeEventForSupplier}
            value={itemFormSelectedForSupplier}
            checked={itemFormSelectedForSupplier}
          />
          <label className="custom-control-label ms-2" htmlFor="customRadio2">
            Supplier
          </label>
        </div>
      </form>

      <div>
        {itemFormSelectedForItem && (
          <>
            <div className="container">
              <h2 className="text-center">Item Details</h2>
              <div className="box">
                {/* <ItemForm
                  handleChangeEventOFItemForm={handleChangeEventOFItemForm}
                  selectedItemForEdit={selectedItemForEdit}
                /> */}

                <div className="container-fluid">
                  <form onSubmit={handleSubmitForItemForm(onSubmitItemForm)}>
                    <div className="row">
                      <div className="col-12 col-lg-6 my-2">
                        <div className="">
                          <label htmlFor="text" className="form-label">
                            Item Name:
                          </label>
                          <input
                            {...registerForItemForm("itemName", { required: true })}
                            type="text"
                            className="form-control"
                            id="itemName"
                            placeholder="Enter"
                            name="itemName"
                            onChange={handleChangeEventOFItemForm}
                            minLength={3}
                            maxLength={255}
                          />
                          <small className="smallHint">Min 50 Characters</small>
                          {errorsForItems?.itemName?.type == "required" && (
                            <span style={{ color: "red" }}>Field is required</span>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-lg-6 my-2">
                        <div className="">
                          <label htmlFor="quantity" className="form-label">
                            Quantiy:
                          </label>
                          <input
                            {...registerForItemForm("quantity", { required: true })}
                            type="text"
                            className="form-control"
                            id="quantity"
                            placeholder="Enter"
                            name="quantity"
                            onChange={handleChangeEventOFItemForm}
                            onKeyDown={handleOnKeyDownOnlyNumber}
                            maxLength={10}
                          // onKeyDown={()=>{setValueForItemForm('quantity',getValuesForItemForm('quantity'))}}
                          />
                          <small className="smallHint">Numeric</small>
                          {errorsForItems?.quantity?.type == "required" && (
                            <span style={{ color: "red" }}>Field is required</span>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="">
                          <label htmlFor="unitPrice" className="form-label">
                            Unit Price:
                          </label>
                          <input
                            {...registerForItemForm("unitPrice", { required: true })}
                            onKeyDown={handleOnKeyDownOnlyNumber}
                            type="text"
                            className="form-control"
                            id="unitPrice"
                            placeholder="Enter"
                            name="unitPrice"
                            onChange={handleChangeEventOFItemForm}
                          />
                          <small className="smallHint">Numeric</small>
                          {errorsForItems?.unitPrice?.type == "required" && (
                            <span style={{ color: "red" }}>Field is required</span>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="">
                          <label htmlFor="submissionDate" className="form-label">
                            Submission Date:
                          </label>
                          <input
                            {...registerForItemForm("submissionDate", { required: true })}
                            min={new Date().toISOString().split("T")[0]}
                            type="date"
                            className="form-control"
                            id="submissionDate"
                            placeholder="Enter"
                            name="submissionDate"
                            onChange={handleChangeEventOFItemForm}
                          />
                          <small ></small>
                          {errorsForItems?.submissionDate?.type == "required" && (
                            <span style={{ color: "red" }}>Field is required</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* {!isValid && */}
                    <div className="w-100 text-center">
                      <button type="submit" className="btn btn-primary my-2">
                        Submit
                      </button>
                    </div>
                    {/* } */}
                  </form>
                </div>

              </div>
            </div>
            <hr></hr>
          </>
        )}

        {itemFormSelectedForSupplier && (
          <>
            <div className="container my-3">
              <h2 className="text-center">Supplier Details</h2>
              <div className="box">
                {/* <SupplierForm
                  handleChangeEventOFSupplierForm={handleChangeEventOFSupplierForm}
                  selectedItemForEdit={selectedItemForEdit}
                /> */}
                <div className="container-fluid">
                  <form onSubmit={handleSubmitForSupplier(onSubmitSupplierForm)}>
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
                            onChange={handleChangeEventOFSupplierForm}
                          />
                          <small className="smallHint" >Max 50 characters</small>
                          {errorsForSupplier?.supplierName?.type == "required" && (
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
                            onChange={handleChangeEventOFSupplierForm}
                          />
                          <small className="smallHint" >Max 50 characters</small>
                          {errorsForSupplier?.companyName?.type == "required" && (
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
                              handleChangeEventOFSupplierForm()
                            }}
                          >

                            <option value={""}>select</option>
                            {countryList?.length > 0 &&
                              countryList?.map((obj, index) => (
                                <option
                                  key={obj?.countryId}
                                  value={obj?.countryId}
                                >{`${obj?.currency} (${obj?.name})`}</option>
                              ))}
                          </select>
                          <small className="smallHint" >Select country from the list</small>
                          {errorsForSupplier?.countryId?.type == "required" && (
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
                              handleChangeEventOFSupplierForm()
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
                          <small className="smallHint" >Select state from the list</small>
                          {errorsForSupplier?.stateId?.type == "required" && (
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
                            onChange={handleChangeEventOFSupplierForm}
                          >

                            <option value={""}>select</option>
                            {cityList?.length > 0 &&
                              cityList?.map((obj, index) => (
                                <option
                                  key={obj?.cityId}
                                  value={obj?.cityId}
                                >{`${obj?.name}`}</option>
                              ))}
                          </select>
                          <small className="smallHint" >Select city from the list</small>
                          {errorsForSupplier?.cityId?.type == "required" && (
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
                            onChange={handleChangeEventOFSupplierForm}
                          />
                          <small className="smallHint" >Enter valid email address</small>
                          {errorsForSupplier?.email?.type == "required" && (
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
                            onChange={handleChangeEventOFSupplierForm}
                          />
                          <small className="smallHint" >Enter valid phone number</small>
                          {errorsForSupplier?.phoneNumber?.type == "required" && (
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
              </div>
            </div>
            <hr></hr>
          </>
        )}
      </div>

      {(formData != null && (itemFormSelectedForItem || itemFormSelectedForSupplier)) && (
        <div className="w-100 text-center">
          <div className="">
            <div className="card-body">
              <h1>Submitted Data</h1>
              <h5>The data submitted will be displayed below </h5>
              <button className="btn btn-primary" onClick={onSubmit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <hr></hr>


      <div className="container my-3">
        <div className="card">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    disabled={tableData?.length == 0}
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e)}
                  />
                </th>
                <th>Supplier</th>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>City</th>
                <th>Country</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>

            <tbody fontSize={"sm"}>
              {!isLoading &&
                tableDataDummy &&
                tableDataDummy?.length > 0 &&
                tableDataDummy.map((item, index) => (
                  <tr
                    key={index + 1}
                    onClick={() => handleSelectedItemForEdit(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item?.itemId)}
                        onChange={(e) => handleCheckboxChange(e, item)}
                      />
                    </td>

                    <td>{item?.Supplier?.companyName || "-"}</td>

                    <td>{item?.itemName || "-"}</td>

                    <td>{item?.quantity || "-"}</td>

                    <td>{item?.Supplier?.cityName || "-"}</td>

                    <td>
                      {/* <input id={`${item.employee}-variable`} step={'.1'} w={'100%'} size={'sm'} type='text' placeholder="Enter..." borderRadius={8} bg={'var(--white-color)'} name={`${item.employee}-base`} autoComplete="off" value={item.variableValue} onKeyDown={handleOnKeyDownOnlyNumber} min={0} /> */}
                      {item?.Supplier?.countryName || "-"}
                    </td>

                    <td>
                      {/* <input id={`${item.employee}-variable`} step={'.1'} w={'100%'} size={'sm'} type='text' placeholder="Enter..." borderRadius={8} bg={'var(--white-color)'} name={`${item.employee}-base`} autoComplete="off" value={item.variableValue} onKeyDown={handleOnKeyDownOnlyNumber} min={0} /> */}
                      {item?.Supplier?.email || "-"}
                    </td>

                    <td>
                      {/* <input id={`${item.employee}-variable`} step={'.1'} w={'100%'} size={'sm'} type='text' placeholder="Enter..." borderRadius={8} bg={'var(--white-color)'} name={`${item.employee}-base`} autoComplete="off" value={item.variableValue} onKeyDown={handleOnKeyDownOnlyNumber} min={0} /> */}
                      {item?.Supplier?.phoneNumber || "-"}
                    </td>
                  </tr>
                ))}
              {!isLoading && tableDataDummy && tableDataDummy?.length == 0 && (
                <tr>
                  <td colSpan={100}>
                    <NoRecordsFound></NoRecordsFound>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Header;
