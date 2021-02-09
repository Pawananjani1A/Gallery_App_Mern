import React from 'react';
import UserItem from './UserItem';
import "./UsersList.css";


const UsersList = (props)=>{


if(props.items.length===0)
{
  return (
        <div className="center">
        No User Found
        </div>
    );
}

const renderList = ()=>{
return props.items.map((item)=>{
    return <UserItem 
    key={item.id}
     id={item.id}
    imageSrc={item.image}
    name={item.name}
    placeCount={item.places.length}
     />;
})
};



return (
    <ul className="users-list">
  {renderList()}
    </ul>
);
    
}



export default UsersList;