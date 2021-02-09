import {useState,useEffect,useCallback} from "react";




let logoutTimer;

export const useAuth = ()=>{
    const [token,setToken] = useState(null);
  const [tokenExpirationDate,setTokenExpirationDate] = useState();
  const [userId,setUserId] = useState(null);

  const login = useCallback((uid,token,expiration)=>{
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate = expiration || new Date(new Date().getTime() + 1000*60*60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem("userData",JSON.stringify({
      userId:uid,
      token:token,
      expiration:tokenExpirationDate.toISOString()
    }));
  },[]);


  const logout = useCallback(()=>{
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  },[]);

  useEffect(()=>{
  const cachedUserData = JSON.parse(localStorage.getItem("userData"));
      if(
        cachedUserData&&
        cachedUserData.token &&
         new Date(cachedUserData.expiration)>new Date()
         )
      {
        login(cachedUserData.userId,cachedUserData.token);
      }
  },[login]);

  useEffect(()=>{

    if(token&&tokenExpirationDate)
    {
         const remainingTime = tokenExpirationDate.getTime()-new Date().getTime();
       logoutTimer =  setTimeout(logout,remainingTime);
    }
    else
    {
      clearTimeout(logoutTimer);
    }

  },[token,tokenExpirationDate,logout]);

  return {token,login,logout,userId};

};