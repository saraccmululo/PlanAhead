import { createContext, useState } from "react";

//1.Create the context
const AuthContext=createContext();

//2.Create provider component
export const AuthProvider =({children})=>{
  //2.1. Get full user info from localStorage and put it into a state to update UI whenever user info changes. 
  const savedUser = JSON.parse(localStorage.getItem("user")) || null;
  
  const [user, setUser]= useState(savedUser);

  //2.2. Create login and logout helper functions:
    //(Advantage: other components don’t need to handle localStorage individually. Consistency: localStorage + state at updated at the same time).

  const login = (userData) => {// Save full user info on local storage and update global state.
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.access_token) {
    localStorage.setItem("access_token", userData.access_token);
  }
    setUser(userData);
  };
  
  const logout = () => {// remove user_id and update state
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
  //3.Make values available to children component
  //!! converts any value(str in this case) into boolean 
    <AuthContext.Provider value={{user, isLoggedIn: !!user, login, logout}}> 
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;