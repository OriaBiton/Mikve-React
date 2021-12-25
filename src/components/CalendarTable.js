import {useEffect, useContext} from 'react';
import {Redirect} from 'react-router-dom';
import firebase from 'firebase';
import {AppointmentContext} from '../context/AppointmentContext';
import 'hebcal/client/hebcal.noloc.min';
import Format from '../classes/format';

let tdToClick;

export default function CalendarTable(props){
  const {selectedMikve, selectedTime, setSelectedTime} = useContext(AppointmentContext);
  let hDate = new window.Hebcal.HDate().before(0); //Start from last Sunday
  let firstDay = true;
  let isInThePast = true;
  let daysToTheFuture = 0;
  const visibleWeeks = 3;
  const clickableFutureDays = 7;
  useEffect(addHours, []);
  
  if (!selectedMikve) return <Redirect to="/choose-mikve" />

  return (
    <table className="mb-2">
      <thead>
        <tr>
          <th>ראשון</th>
          <th>שני</th>
          <th>שלישי</th>
          <th>רביעי</th>
          <th>חמישי</th>
          <th>שישי</th>
          <th>שבת</th>
        </tr>
      </thead>
      <tbody>
        {
          [...Array(visibleWeeks)].map((_, key) =>
           <tr key={key}>{ [...Array(7)].map(getTD) }</tr>
          )
        }
      </tbody>
    </table>
  );

  function getTD(_, i){
    if (!firstDay) hDate = hDate.next();
    else firstDay = false;    
    const greg = hDate.greg();
    const dayOfWeek = greg.getDay();
    const gregDay = greg.getDate();
    const gregMonthInt = greg.getMonth() + 1;
    const gregMonthString = greg.toLocaleString('he', { month: 'long' });
    const gregYear = greg.getYear();
    const isToday = gregDay == new Date().getDate();
    const isFirstInHebMonth = hDate.day === 1;
    const isFirstInGregMonth = gregDay === 1;
    const holidays = hDate.holidays();
    const isHoliday = holidays.length && !holidays[0].desc[2].includes('ראש חודש')
    const td = document.createElement('td');
    if (isToday) isInThePast = false;
    if (isFirstInHebMonth) td.classList.add('first-in-heb-month');
    if (isFirstInGregMonth) td.classList.add('first-in-greg-month');
    if (!isInThePast && daysToTheFuture <= clickableFutureDays) {
      if (!isOffDay()) addShabbat();
      daysToTheFuture++;
    }

    return (
      <td className={`date
        ${(isToday ? ' today' : '')}
        ${(isFirstInHebMonth ? ' first-in-heb-month' : '')}
        ${(isFirstInGregMonth ? ' first-in-greg-month' : '')}
        ${(isHoliday ? ' holiday' : '')}
        ${((!isInThePast && daysToTheFuture <= clickableFutureDays)
            && !isOffDay()) ? ' allowed' : ''}`}
      data-heb-day={gematriya(hDate.day)}
      data-heb-month={hDate.getMonthName('h')}
      data-greg-day={gregDay}
      data-greg-month-int={gregMonthInt}
      data-greg-month-string={gregMonthString}
      data-greg-year={gregYear}
      data-day-of-week={dayOfWeek}
      data-sunset={getSunset(hDate)}
      data-holiday={isHoliday ?
        holidays[0].desc[2].replace('שבת ', '').replace('צום ', '') : ''}
      data-time-name={addShabbat()}
      onClick={setDate}
      key={i}
      >
        <span>
          {props.view == 'heb' ? gematriya(hDate.day) : gregDay}
        </span>
      </td>
    );

    function isOffDay(){
      if (!holidays.length) return false;
      const txt = holidays[0].desc[2];
      const offDays = ['כיפור', 'תשעה באב'];
      for (const day of offDays)
        if (txt.includes(day)) return true;
      return false;
    }
    function addShabbat(){
      let time;
      let timeName;
      const candles = hDate.candleLighting();
      const havdala = hDate.havdalah();
      if (candles) {
        timeName = 'candles';
        time = candles;
      }
      else if (havdala) {
        timeName = 'havdala';
        time = havdala;
      }
      else return;
      return Format.dateToColon(time);      
    }
    function getSunset(d){
      const eve = d.gregEve();
      return Format.dateToColon(eve);
    }
    function gematriya(n){
      const letters = [
        'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב', 'יג',
        'יד', 'טו', 'טז', 'יז', 'יח', 'יט', 'כ', 'כא', 'כב', 'כג', 'כד',
        'כה', 'כו', 'כז', 'כח', 'כט', 'ל', 'לא'
      ];
      return letters[--n];
    }    

  }

  function setDate(e){
    const td = e.target.nodeName == 'TD' ?
      e.target : e.target.closest('td');
    const isActive = td.classList.contains('active');
    const data = td.dataset;
    if (!data.ready) {
      //notyf.info('טוען לוח שעות. כמה רגעים בבקשה...');
      tdToClick = td;
      return;
    }
    if (tdToClick && tdToClick.isSameNode(td)){
      tdToClick = null;
      //notyf.success('לוח השעות מוכן! את מוזמנת לבחור שעה.');
    }

    markDate();
    fillHourSelect();
    clearDescription();

    setSelectedTime({td});

    function clearDescription(){
      document.querySelector('.description').innerText = '';
    }
    function fillHourSelect(){
      const select = document.getElementById('select-hour');
      select.disabled = isActive;
      clear();
      addAllowed();
      disableTaken();

      function disableTaken(){
        let taken = data.takenHours;
        if (!taken) return;
        taken = taken.split(',');
        for (const t of taken){
          const o = select.querySelector(`[value="${t}"]`);
          o.disabled = true;
          o.innerText += ' ❌';
        }
      }
      function addAllowed(){
        const allowedHours = data.allowedHours.split(',');
        for (const hour of allowedHours) {
          if (!hour) continue;
          const opt = document.createElement('option');
          opt.value = hour;
          opt.innerText = Format.addColon(hour);
          select.add(opt);
        }
      }
      function clear(){
        for (let i = select.length; i > 0; i--) select.remove(i);
      }
    }
    function markDate(){
      const tbody = td.closest('tbody');
      if (isActive) return deactivate();
      const currentlyActive = tbody.querySelector('td.active');
      deactivate(currentlyActive);
      td.classList.add('active');

      function deactivate(c){
        if (c) c.classList.remove('active');
        else td.classList.remove('active');
      }
    }
  }

  async function addHours(){
    if (!selectedMikve) return;
    console.log(selectedMikve);
    const functions = firebase.app().functions('europe-west3');
    const getTakenHours = functions.httpsCallable('getTakenHours');
    const mikveName = selectedMikve.key;
    const ranges = getRanges();
    const allowed = document.querySelectorAll('td.allowed');
    const datasetsOfAllowed = Array.from(allowed).map(a => a.dataset);
    const takenPayload = {mikveName, dates: datasetsOfAllowed};
    const taken = (await getTakenHours(takenPayload)).data;
    for (const td of allowed) {
      const isToday = td.classList.contains('today');
      const dayData = clearPreviousHours(td.dataset);
      const gregDay = dayData.gregDay;
      const candles = dayData.candles;
      const havdala = dayData.havdala;
      let dayType = 'weekdays';
      if (candles) dayType = 'friday';
      else if (havdala) dayType = 'saturday';
      let hours = spread(ranges[dayType].from, ranges[dayType].until, dayData);
      if (isToday) hours = removePastHours(hours);
      dayData.allowedHours = hours;
      if (!dayData.allowedHours) {
        td.classList.remove('allowed');
        td.removeEventListener('click', setDate);
        continue;
      }
      if (taken[gregDay]) dayData.takenHours =
        isToday ? removePastHours(taken[gregDay]) : taken[gregDay];
      td.dataset.ready = true;
    }
    if (tdToClick) tdToClick.click();
  
    function clearPreviousHours(data){
      if (data.allowedHours) data.allowedHours = '';
      if (data.takenHours) data.takenHours = '';
      return data;
    }
    function removePastHours(hours){
      let now = new Date();
      now = Format.to4Chars(now.getHours(), now.getMinutes());
      for (let i = hours.length; i >= 0; i--) {
        if (hours[i] < now) hours.splice(i, 1);
      }
      return hours;
    }
    function getRanges(){
      return selectedMikve.hours[getSeason()];
  
      function getSeason(){
        const seasons = ['winter', 'summer'];
        return seasons[Math.floor(new Date().getMonth() / 12 * 2) % 2];
      }
    }
    function spread(from, until, dayData){
      from = Format.toHourMinutesObject(from, dayData);
      until = Format.toHourMinutesObject(until, dayData);
      const step = 5; // Interval in minutes
      let iM = from.minutes;
      const arr = [];
      for (let iH = from.hour; iH <= until.hour; iH++) {
        while (iM < 60) {
          if (iH == until.hour && iM > until.minutes) break;
          arr.push(Format.to4Chars(iH, iM));
          iM += step;
        }
        iM -= 60;
      }
      return arr;
    }
  
  }

}
