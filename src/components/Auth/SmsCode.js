import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext'; 
import { LoadingContext } from '../../context/LoadingContext';
import { Redirect } from 'react-router-dom';
import Section from '../Section';

export default function SmsCode(){
	const {auth, setUser} = useContext(AuthContext);
	const {setLoading} = useContext(LoadingContext);
	const {confirmationResult} = auth;
	const [code, setCode] = useState(null);
	useEffect(() => setLoading(false), []);
	
	if (!confirmationResult) return <Redirect to='/sign-in' />;
	return (
		<Section name='אימות מספר טלפון'>
			<form className="p-side-3" onSubmit={submit}>
				<h2>📱 הזינו את הקוד שנשלח אליכם בהודעת SMS:</h2>
				<div className="field">
					<label htmlFor="sms-code">קוד בן 6 ספרות</label>
					<input type="text" inputMode="numeric"
						autoComplete="one-time-code"
						onChange={change} required />
				</div>
				<div className="middle">
					<button type="submit">אישור</button>
				</div>
				<p className="m-0">
					<small id="no-sms" className="pointer">לא קיבלתי שום הודעה</small>
				</p>
			</form>
		</Section>
	);
	
	function change(e) {
		const value = e.target.value;
		setCode(value);
	}
	async function submit(e){
		e.preventDefault();
		const result = await confirmationResult.confirm(code);
		// User signed in successfully.
		setUser(result.user);
	}
}
