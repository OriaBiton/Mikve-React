import { useContext } from "react";
import { AppointmentContext } from "../context/AppointmentContext";

export default function MikveCard(props){
  const {mikves, selectedMikve, setSelectedMikve} = useContext(AppointmentContext);
  const id = props.id;
  const mikve = mikves[id];
  const {name, img, rating} = mikve;
  const isSelected = selectedMikve?.name == name;
  return (
    <div className={'card' + (isSelected ? ' active' : '')}
    onClick={toggleSelection} data-key={selectedMikve?.key}>
      <img src={img} className="card-pic"/>
      <h3 className="m-0">{name}</h3>
      {stars()}
      <p></p>
      <svg className={`${(!isSelected ? 'hidden ' : '')}checkmark`} viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
    </div>
  );

  function toggleSelection(){
    if (selectedMikve == mikve) setSelectedMikve(null);
    else if (selectedMikve || !selectedMikve) setSelectedMikve(mikve);
  }
  function stars(){
    const score = Math.round(rating.stars * 2) / 2;
    return (
      <div className="stars"
      title={`המקווה דורג ${rating.stars} כוכבים ע"י ${rating.voters} הצבעות`}>
        {[...Array(Math.round(score - 0.5))].map((_, i) => 
          <img src="images/star-mini.png" key={i}/>
        )}
        {!isInt(score) && <img src="images/half-star-mini.png"/>}
      </div>
    );
  }

}
function isInt(n) { return n % 1 === 0 }

