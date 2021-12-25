import { useContext } from "react";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Section from "./Section";

export default function Home(){
  const {user} = useContext(AuthContext).auth;
  if (!user) return <Redirect to="/sign-in" />;
  return (
    <Section name='דף הבית'>
			<h2 id="greeting">היי, {user.displayName}</h2>
			<div className="middle">
				<div id="my-appointment" hidden data-client-ui>
					<h2>📍 התור הבא שלך:</h2>
				</div>
				<Link to="/choose-mikve">
					<button>לקביעת תור</button>
				</Link>
				<button className="secondary" data-admin-ui>רשימת תורים</button>
				<a href="https://mdby.org.il/mikve" target="_blank" data-client-ui>
					<button className="secondary">מידע נוסף / מחלקת מקוואות</button>
				</a>
				<div className="flex" data-client-ui>
					<img src="images/phone.png" title="התקשרו למחלקת מקוואות" className="pointer"/>
					<img src="images/whatsapp.png" title="ווצאפ מחלקת מקוואות" className="pointer"/>
				</div>
			</div>
			<div className="modal" id="star-mikve-modal" data-client-ui hidden>
				<div className="modal-content">
					<span className="close">×</span>
					<div className="modal-header">
						<h1>דירוג מקווה</h1>
					</div>
					<div className="modal-body">
						<div id="star-mikve">
							<p><strong></strong></p>
							<div className="rate">
								<input type="radio" id="rate-star5" name="rate-mikve" value="5"/>
								<label htmlFor="rate-star5" title="5"></label>
								<input type="radio" id="rate-star4" name="rate-mikve" value="4"/>
								<label htmlFor="rate-star4" title="4"></label>
								<input type="radio" id="rate-star3" name="rate-mikve" value="3" defaultChecked/>
								<label htmlFor="rate-star3" title="3"></label>
								<input type="radio" id="rate-star2" name="rate-mikve" value="2"/>
								<label htmlFor="rate-star2" title="2"></label>
								<input type="radio" id="rate-star1" name="rate-mikve" value="1"/>
								<label htmlFor="rate-star1" title="1"></label>
							</div>
							<button id="star-mikve-btn" className="small-btn">אישור</button>
							<button id="dont-star-btn" className="small-btn danger">בפעם אחרת</button>
						</div>
					</div>
				</div>
			</div>
		</Section>
  );
}