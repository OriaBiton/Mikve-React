import { useState, useContext } from 'react';
import Format from '../classes/format';
import { AppointmentContext } from '../context/AppointmentContext';
import CalendarTable from './CalendarTable';
import Section from "./Section";

export default function ChooseTime(){  
  const [view, setView] = useState('heb');
  const [ready, setReady] = useState(false);
  const {selectedTime, setSelectedTime} = useContext(AppointmentContext);
  const tdData = selectedTime?.td?.dataset;
  const hour = selectedTime?.hour;

  return (
    <Section name="יום ושעה" back={{to: '/choose-mikve', title: 'בחירת מקווה'}}>
      <h2>🕒 בחרי תאריך ושעה:</h2>
      <div className="float-l">
        <input type="radio" value="heb" name="schedule-type" id="schedule-to-heb"
          onClick={changeView} defaultChecked/>
        <label htmlFor="schedule-to-heb" className="inline">עברי</label>
        <input type="radio" value="greg" name="schedule-type" id="schedule-to-greg"
          onClick={changeView}/>
        <label htmlFor="schedule-to-greg" className="inline">לועזי</label>
      </div>
      <CalendarTable view={view}/>
      <div className="select center">
        <select id="select-hour"
          disabled onChange={setHour}>
          <option value="" defaultValue>בחרי שעה</option>
        </select>
      </div>
      <p className="description">
        {
          (tdData && hour) &&
          `✔️ בחרת ביום ${Format.toWeekday(tdData.dayOfWeek)}, ${tdData.hebDay} ב${tdData.hebMonth}\
          (${tdData.gregDay}/${tdData.gregMonthInt}/${tdData.gregYear}), בשעה ${hour}.`
        }
      </p>
      <button disabled={!ready} onClick={set}>
        אישור
      </button>
    </Section>
  );

  function setHour(e){
    const hour = e.target.value;
    setSelectedTime({...selectedTime, hour})
    setReady(true);
  }
  function set(){
    console.log(selectedTime);
  }
  function changeView(e){
    setView(e.target.value);
  }
}