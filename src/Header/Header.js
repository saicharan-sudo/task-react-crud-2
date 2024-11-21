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

  const taostService = useToaster();

  const [formData, setFormData] = useState(null);

  const [itemFormValid, setItemFormValid] = useState(false);

  const [supplierFormValid, setSupplierFormValid] = useState(false);

  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);

  // const { register:registerForForItemForm, handleSubmit:handleSubmitForItemForm, control:controlForItemForm, formState: { errors:errorsForItemForm, isValid:isValidForItemForm, }, setValue:setValueForItemForm, setError:setErrorForItemForm, clearErrors:clearErrorsForItemForm, getValues:getValuesForItemForm, watch:watchForItemForm, setFocus:setFocusForItemForm, reset:resetItemForm } = useForm();
  // const { register:registerForForSupplierForm, handleSubmit:handleSubmitForSupplierForm, control:controlForSupplierForm, formState: { errors:errorsForSupplierForm, isValid:isValidForSupplierForm, }, setValue:setValueForSupplierForm, setError:setErrorForSupplierForm, clearErrors:clearErrorsForSupplierForm, getValues:getValuesForSupplierForm, watch:watchForSupplierForm, setFocus:setFocusForSupplierForm, reset:resetSupplierForm } = useForm();

  useEffect(() => {
    getData();
  }, []);

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
        taostService.showErrorMessage(error.message);
      });
  }

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

  function handleChangeEventOFSupplierForm(data, isValid) {
    // let data = {
    //     "supplier":data
    // }
    setFormData({
      ...formData,
      supplier: data,
    });
    setSupplierFormValid(isValid);
  }

  function handleChangeEventOFItemForm(data, isValid) {
    // let data = {
    //     "itemDetails":data
    // }
    setFormData({
      ...formData,
      itemDetails: data,
    });
    setItemFormValid(isValid);
  }

  function handleChangeEventForItem(event) {
    let check = event.target.checked;
    setItemFormSelectedForItem((prev) => (prev = !prev));
    if (!check) {
      setFormData({
        ...formData,
        itemDetails: {},
      });
    }
  }

  function handleChangeEventForSupplier(event) {
    let check = event.target.checked;
    setItemFormSelectedForSupplier((prev) => (prev = !prev));
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
      taostService.showErrorMessage("Please enter the data in both the form");
      return;
    }

    if (itemFormSelectedForItem && !itemFormValid) {
      taostService.showErrorMessage("please fill the item form completely");
      return;
    }
    if (itemFormSelectedForSupplier && !supplierFormValid) {
      taostService.showErrorMessage("please fill the supplier form completely");
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
        taostService.showErrorMessage(error.response.data.message);
        setIsLoading(false);
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
        taostService.showErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  function handleSelectedItemForEdit(item) {
    setSelectedItemForEdit(item);
    setItemFormSelectedForItem(true);
    setItemFormSelectedForSupplier(true);
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

      <form className="d-flex justify-content-center gap-2">
        <div className="custom-control custom-checkbox custom-control-inline">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customRadio"
            name="example"
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
            value="supplier"
            onChange={handleChangeEventForSupplier}
          />
          <label className="custom-control-label ms-2" htmlFor="customRadio2">
            Supplier
          </label>
        </div>
      </form>

      <div>
        {itemFormSelectedForItem && (
          <ItemForm
            handleChangeEventOFItemForm={handleChangeEventOFItemForm}
            selectedItemForEdit={selectedItemForEdit}
          />
        )}

        {itemFormSelectedForSupplier && (
          <SupplierForm
            handleChangeEventOFSupplierForm={handleChangeEventOFSupplierForm}
            selectedItemForEdit={selectedItemForEdit}
          />
        )}
      </div>

      {formData != null && (
        <div>
          Submitted Data
          <p>The data submitted will be displayed below </p>
          <button className="btn btn-primary" onClick={onSubmit}>
            Save Changes
          </button>
        </div>
      )}

      <table className="table table-hover">
        <thead>
          <tr>
            <th
              color={"var(--primary-text-color)"}
              style={{ textAlign: "center" }}
            >
              <input
                type="checkbox"
                disabled={tableData?.length == 0}
                checked={selectAll}
                onChange={(e) => handleSelectAll(e)}
              />
            </th>
            <th style={{ textAlign: "center" }}>Supplier</th>
            <th color={"var(--primary-text-color)"}>Item Name</th>
            <th>Quantity</th>
            <th color={"var(--primary-text-color)"}>City</th>
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
                <td textAlign={"center"}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item?.itemId)}
                    onChange={(e) => handleCheckboxChange(e, item)}
                  />
                </td>

                <td>{item?.Supplier?.companyName || "-"}</td>

                <td>{item?.itemName || "-"}</td>

                <td>{item?.grade || "-"}</td>

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
    </>
  );
}

export default Header;
