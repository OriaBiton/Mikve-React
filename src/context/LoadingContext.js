import {createContext, useState} from 'react';

export const LoadingContext = createContext();

export function LoadingProvider(props){
  const [isLoading, setLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{isLoading, setLoading}}>
      {props.children}
    </LoadingContext.Provider>
  );
}