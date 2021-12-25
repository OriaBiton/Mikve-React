import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppointmentContext } from '../context/AppointmentContext';
import Section from "./Section";
import MikveCard from './MikveCard';

export default function ChooseMikve(){
  const {mikves, selectedMikve} = useContext(AppointmentContext);
  const {name, address} = selectedMikve || '';

  return (
    <Section name="בחירת מקווה" back={{to: "/", title: "דף הבית"}}>
      <h2>💧 בחרי מקווה בו תעדיפי לטבול:</h2>
      <div className="mikve-cards">
        {mikves && Object.entries(mikves).map(([key, m]) =>
          <MikveCard key={key} id={key} />
        )}
      </div>
      { selectedMikve &&
        <p className="description">
          ✔️ בחרת במקווה "{name}", בכתובת {address}.
        </p>
      } 
      <Link to="/time" style={{pointerEvents: selectedMikve ? 'initial' : 'none'}}>
        <button disabled={!selectedMikve}>קביעת תור</button>
      </Link>    
    </Section>
  );
}