import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Service from "../Common/Service/Service";
import { useDebounce } from "../Common/Debounce/useDebounce";

function ItemForm(props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    setValue,
    setError,
    clearErrors,
    getValues,
    watch,
    setFocus,
    reset,
  } = useForm();

  const apiService = Service();

  const formDebounce = useDebounce("data", 1000);
  useEffect(() => {
    if (props.selectedItemForEdit != null) {
      Object.entries(props.selectedItemForEdit).forEach(([name, value]) =>
        setValue(name, value)
      );
    }
  }, [props.selectedItemForEdit]);

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

  useEffect(() => {
    handleChage();
  }, [formDebounce]);

  function handleChage() {
    const data = getValues();
    // console.log(data);
    props.handleChangeEventOFItemForm(data);
    // let timerId;
    // return (...args)=>{
    //     if(timerId){
    //         clearInterval(timerId);
    //     }
    //     timerId = setInterval(()=>{
    //     },100)
    // }
  }

  const onSubmit = () => {
    const data = getValues();
    props.handleChangeEventOFItemForm(data, isValid);
  };

  return (
    <div>
      {JSON.stringify(isValid)}sdfljskflsjdl
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-3 mt-3">
              <label htmlFor="text" className="form-label">
                Item Name:
              </label>
              <input
                {...register("itemName", { required: true })}
                type="text"
                className="form-control"
                id="itemName"
                placeholder="Enter"
                name="itemName"
                onChange={handleChage}
              />
              {errors?.itemName?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">
                Quantiy:
              </label>
              <input
                {...register("quantity", { required: true })}
                type="text"
                className="form-control"
                id="quantity"
                placeholder="Enter"
                name="quantity"
                onChange={handleChage}
              />
              {errors?.quantity?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label htmlFor="unitPrice" className="form-label">
                Unit Price:
              </label>
              <input
                {...register("unitPrice", { required: true })}
                type="text"
                className="form-control"
                id="unitPrice"
                placeholder="Enter"
                name="unitPrice"
                onChange={handleChage}
              />
              {errors?.unitPrice?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-3">
              <label htmlFor="submissionDate" className="form-label">
                Submission Date:
              </label>
              <input
                {...register("submissionDate", { required: true })}
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="form-control"
                id="submissionDate"
                placeholder="Enter"
                name="submissionDate"
                onChange={handleChage}
              />
              {errors?.submissionDate?.type == "required" && (
                <span style={{ color: "red" }}>Field is required</span>
              )}
            </div>
          </div>
        </div>

        {/* {!isValid && */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        {/* } */}
      </form>
    </div>
  );
}

export default ItemForm;
