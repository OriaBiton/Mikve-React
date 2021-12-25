import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LoadingContext } from '../context/LoadingContext';
let svg;

export default function Section(props){
  const {name, back} = props;
  const [svgDiv, setSvgDiv] = useState(null);
  const {isLoading} = useContext(LoadingContext);
  const backLink = back ? <div className="pos-rel">
      <Link to={back.to} className="back" title={back.title}>
        ➜
      </Link>
    </div> : null;
    
  useEffect(async () => {
    if (!svg) svg = await getSVG();
    setSvgDiv(<div className='h1-wave'
      dangerouslySetInnerHTML={{__html: svg}}></div>);
  }, []);

  return (
    <section hidden={isLoading ? true : false}>
			<h1>{name}</h1>
      {svgDiv}
			<div className={"p-side-3"}>
        {back && backLink}
        {props.children}
      </div>
    </section>
  );

}
async function getSVG(){
  return await (await fetch('images/h1bg.svg')).text();
}
