import React, { useEffect, useReducer} from "react";
import {validate} from "../../util/validators";
import "./Input.css"

const inputReducer = (state,action)=>{

    switch (action.type)
    {
        case "CHANGE":
            return {
               ...state,
               value:action.value,
               isValid:validate(action.value,action.validators)
            };
        case "TOUCH":
            return {
                ...state,
                isTouched:true
            }
        default:
            return state;
    }
}

const INPUT = (props)=>{
//   console.log(props);
  const [inputState,dispatch] = useReducer(inputReducer,
    {
      value:props.initialValue || "",
      isValid:props.initialIsValid || false,
      isTouched:false
    });

    const changeHandler = event=>{
            dispatch({type:"CHANGE",value:event.target.value,validators:props.validators});
    }

    const touchHandler = ()=>{
        dispatch({type:"TOUCH"});
    }

    const {id,onInput} = props;
    const {value,isValid} = inputState;

    useEffect(()=>{
        onInput(id,value,isValid);
    },[id,value,isValid,onInput]);
   
    const element = props.element==="input"?<input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onBlur={touchHandler}
        onChange={changeHandler}
        value={inputState.value}
        autoComplete="off"
    />:<textarea id={props.id} rows={props.rows||3} onBlur={touchHandler} onChange={changeHandler} value={inputState.value}/>;

    return (<div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
           <label htmlFor={props.id}>{props.label}</label>
           {element}
           {!inputState.isValid &&inputState.isTouched && <div>{props.errorText}</div>}
            </div>);

}





export default INPUT;