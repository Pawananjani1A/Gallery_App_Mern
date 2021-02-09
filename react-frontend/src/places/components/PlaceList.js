import React, { useContext } from "react";
import "./PlaceList.css";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import {AuthContext} from "../../shared/contexts/auth-context";
import Button from "../../shared/components/FormElements/Button";


const PlaceList = (props)=>{

    // console.log(props);
    const auth = useContext(AuthContext);

     if(props.items.length===0)
     {
         return (<div className="place-list center">
         <Card>
          <h2>No Places Found.</h2>   
            {auth.userId===props.userId &&<h2>Maybe CreateOne?</h2>}
             {auth.userId===props.userId &&<Button to="/places/new">Share Place</Button>} 
         </Card>
         </div>);
     }



return (
    <ul className="place-list">
       {props.items.map(place=><PlaceItem
           key={place.id}
           id={place.id}
           image={place.image}
           title={place.title}
           description={place.description}
           address={place.address}
           creatorId={place.creator}
           coordinates={place.location}
           onDelete={props.onDeletePlace}
       /> )}
    </ul>
);

}



export default PlaceList;