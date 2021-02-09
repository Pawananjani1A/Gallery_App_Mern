import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom';

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/form-hook";
import {useHttpClient} from "../../shared/hooks/http-hook";
import {AuthContext} from "../../shared/contexts/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PlaceForm.css"







const NewPlaces = ()=>{

const auth = useContext(AuthContext);
const history = useHistory();

 const [formState,inputHandler] = useForm({
      title:{
          value:"",
          isValid:false
      },
      description:{
          value:"",
          isValid:false
      },
      address:{
          value:"",
          isValid:false
      },
      image:{
          value:null,
          isValid:false
      }
  },
  false
  );  

  const {isLoading,error,sendRequest,clearError}  = useHttpClient();

  const placeSubmitHandler = async(event)=>{
        event.preventDefault();
        // console.log("New formState : ",formState.inputs);
        const formData = new FormData();
        formData.append('title',formState.inputs.title.value);
        formData.append('description',formState.inputs.description.value);
        formData.append('address',formState.inputs.address.value);
        formData.append('image',formState.inputs.image.value);
        try {
          await sendRequest(
            process.env.REACT_APP_BACKEND_URL+"/places",
            'POST',
            formData,
            {
                Authorization:'Bearer '+auth.token
            }
        );
        //Redirect the user to a different page
        history.push("/");
        } catch (err) {
            //Do nothing as errorHandling is done inside "http-hook" only
        }
        
    }

    return (
        <React.Fragment>
         <ErrorModal error={error} onClear={clearError}/>
          <form className="place-form" onSubmit={placeSubmitHandler}>
          {isLoading&&<LoadingSpinner asOverlay/>}
            <Input 
            id="title"
            element="input" 
            type="text" 
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={<p>Please enter a valid title.</p>}
            onInput={inputHandler}
            />
         <Input 
            id="description"
            element="textarea" 
            type="text" 
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText={<p>Please enter a valid description(at least 5 characters).</p>}
            onInput={inputHandler}
            />
        <Input 
            id="address"
            element="input" 
            type="text" 
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText={<p>Please enter a valid address.</p>}
            onInput={inputHandler}
            />
            <ImageUpload 
            id="image" 
            onInput={inputHandler}
            errorText={<p>Please provide an image.</p>}
            />
        <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
        </form>
        </React.Fragment>
       
    );
}



export default NewPlaces;