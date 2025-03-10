import React from "react";

// Create the context
const UserContext = React.createContext();

// Provides the context to the components
export const UserProvider = UserContext.Provider;

export default UserContext;

export { UserContext }; 