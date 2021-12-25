import React from 'react';
import firebase from 'firebase';
import { AuthContext } from '../../context/AuthContext';
import { Redirect } from 'react-router-dom';
import Section from '../Section';

let didRenderRecaptcha = false;

export default class SignIn extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			name: null,
			phone: null
		};
	}
	static contextType = AuthContext;
	
  render(){
		const {user, confirmationResult} = this.context.auth;
		if (user) return <Redirect to='/' />;
		if (confirmationResult) return <Redirect to='/sms' />;
		return (
			<Section name="כניסה">				
				<form className="p-side-3" onSubmit={this.props.onSubmit}>
					<h2>🧾 מלאי את הפרטים והכנסי לחשבונך האישי.</h2>
					<p><strong>כניסה באמצעות הודעת SMS לנייד</strong></p>
					<div className="field">
						<label htmlFor="name">שם:</label>
						<input type="text" id="name" onChange={e => this.change(e)} required placeholder="הזינו את שמכם המלא"/>
					</div>
					<div className="field">
						<label htmlFor="phone">מספר הטלפון הנייד</label>
						<input type="tel" id="phone" onChange={e => this.change(e)} required placeholder="הזינו את מספר הטלפון שלכם"/>
					</div>
					<div className="middle">
        		<button type="submit">כניסה</button>
      		</div>
				</form>
			</Section>
		);
	}
	componentDidMount(){
		if (didRenderRecaptcha) return;
    this.reCaptchaVerifier = new firebase.auth
			.RecaptchaVerifier('signup-submit', {
      size: 'invisible',
      callback: () => this.onRecaptchaSolved()
    });
		this.reCaptchaVerifier.render();
		didRenderRecaptcha = true;
	}

	change(e) {
		const {id, value} = e.target;
		this.setState({[id]: value});
	}

	onRecaptchaSolved(){
		const appVerifier = this.reCaptchaVerifier;
		const {setConfirmationResult} = this.context;
		const phone = formatNumber(this.state.phone);
		firebase.auth().signInWithPhoneNumber(phone, appVerifier)
		.then(confirmationResult => {
			// SMS sent. Prompt user to type the code from the message, then sign the
			// user in with confirmationResult.confirm(code).
			setConfirmationResult(confirmationResult);
		}).catch(e => {
			console.error(e);
			appVerifier.render().then(widgetId =>
				window.grecaptcha.reset(widgetId));
		});

		function formatNumber(p){
			p = p.trim();
			if (!p.startsWith('0')) return p;
			return '+972' + p.slice(1);
		}
	}

  
}
