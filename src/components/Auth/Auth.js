import { useContext , useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { LoadingContext } from '../../context/LoadingContext';

import SignIn from "./SignIn";
import SmsCode from "./SmsCode";

export default function Auth(){
  const {setLoading} = useContext(LoadingContext);
  const submitBtn = useRef(null);

  return (
    <>
      <Switch>
        <Route path='/sign-in'>
          <SignIn onSubmit={clickRealButton} />
        </Route>
        <Route path='/sms' component={SmsCode} />
      </Switch>
      <button id="signup-submit" ref={submitBtn} hidden></button>
    </>
  );

  function clickRealButton(e){
    e.preventDefault();
    setLoading(true);
    console.log('clicking the real captcha button...');
    submitBtn.current.click();
  }
}
