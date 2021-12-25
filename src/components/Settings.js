import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Redirect } from "react-router";
import Section  from './Section';

export default function Settings(){
  const {auth, setName, signout} = useContext(AuthContext);
	const [userName, setUserName] = useState(null);
	const [done, setDone] = useState(false);
	const {user} = auth;
  if (!user || done) return <Redirect to="/" />;
  return (
    <Section name='הגדרות'>
			<p className="mb-0">
				⚙️ כאן ניתן לבצע פעולות ושינויים בחשבון שלך.
			</p>
			<form>
				<div className="mxh-40">
					<div className="field">
						<h2>שינוי שם</h2>
						<label htmlFor="new-name">שם מלא:</label>
						<input type="text" id="new-name"
							className="w-80p" onChange={changeNameVal}/>
					</div>
					<div className="field">
						<h2>יציאה מהחשבון</h2>
						<label htmlFor="logout">התנתקות מהחשבון שלכם.</label>
						<button type="button" id="logout"
							className="small-btn danger"
							onClick={signout}>יציאה</button>
					</div>
				</div>
				<div className="flex">
					<button onClick={submit}>בצע שינויים</button>
					<button type="button" className="danger"
					onClick={() => setDone(true)}>ביטול</button>
				</div>
			</form>
		</Section>
  );

	function submit(e){
		e.preventDefault();
		setName(userName);
		setDone(true);
	}
	function changeNameVal(e){
		e.preventDefault();
		const name = e.target.value;
		setUserName(name);
	}
}