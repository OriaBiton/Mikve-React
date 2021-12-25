import {createContext, useEffect, useState} from 'react';
import firebase from 'firebase';

export const AppointmentContext = createContext();

export function AppointmentProvider(props){
  const [mikves, setMikves] = useState(null);
  const [selectedMikve, setSelectedMikve] = useState(null);
  const [selectedTime, setSelectedTime] = useState({});
   
  useEffect(async () => {
    if (mikves) return;
    const db = firebase.database();
    const miks = (await db.ref('mikvaot').once('value')).val();
    for (const k in miks) miks[k].key = k;
    setMikves(miks);
  }, []);

  return (
    <AppointmentContext.Provider value={
    {mikves, selectedMikve, setSelectedMikve, selectedTime, setSelectedTime}
    }>
      {props.children}
    </AppointmentContext.Provider>
  );

}