import { LoadingContext } from "../context/LoadingContext";
import { useContext, useEffect } from "react";

export default function Loading(){
  const {isLoading, setLoading} = useContext(LoadingContext);
  
  useEffect(afterLoad, []);

  if (!isLoading) return null;
  
  return (
    <div id="loading" className="middle mt-10">
			<img src="images/loading.svg"/>
		</div>
  );

  function afterLoad(){
    window.addEventListener('load', () => setLoading(false));
  }
}