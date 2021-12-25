import {createContext, useState, useEffect} from 'react';
import firebase from 'firebase';

export const AuthContext = createContext();

export function AuthProvider(props){
  const [auth, setAuth] = useState({
    user: null,
    phone: null,
    confirmationResult: null,
    isAdmin: false
  });

  useEffect(onAuthChange, []);

  return (
    <AuthContext.Provider
    value={{auth, setUser, setName, signout, setConfirmationResult}}>
      {props.children}
    </AuthContext.Provider>
  );

  function onAuthChange(){
    const auth = firebase.auth();
    auth.languageCode = 'he';
    auth.onAuthStateChanged(async user => {
      if (user) {
        const isAdmin = await isUserAdmin(user);
        setAuth({user, isAdmin});
        console.log('Welcome, ' + user.displayName);
      }
      else setAuth({});
    });
  }
  
  function setUser(user){
    setAuth({...auth, user});
  }
  
  function setConfirmationResult(c){
    setAuth({...auth, confirmationResult: c});
  }
  function signout(){
    firebase.auth().signOut();
  }
  
  async function setName(n){
    const {user} = auth;
    await user.updateProfile({ displayName: n })
    .catch(err => { showErrors(err); throw err; });
    console.log('The name is: ' + user.displayName);
    setAuth({...auth, user});
  }

}

async function isUserAdmin(user, isRetry){
  const byStorage = localStorage.getItem('isAdmin');
  if (byStorage == user.uid + ':false') return false;
  else if (byStorage == user.uid + ':true') return true;

  const idTokenResult = await user.getIdTokenResult(true);
  if (idTokenResult.claims.admin){
    localStorage.setItem('isAdmin', user.uid + ':true');
    console.log('admin!');
    return true;
  }
  else {
    console.log('not admin');
    if (!isRetry) setTimeout(() => {
      isUserAdmin(user, true);
      localStorage.setItem('isAdmin', user.uid + ':false');
    }, 5000);
    return false;
  }
}

function showErrors(err){
  let notification;
  const msg = err.message;
  console.log(msg);
  const handlers = [{
    identifier: 'SMS verification code used to create the phone auth credential is invalid',
    notif: 'הקוד שהזנתם שגוי. אנא נסו שנית.',
    action: null
  }];
  for (const handler of handlers){
    if (msg.includes(handler.identifier)){
      notification = handler.notif;
      if (handler.action) handler.action();
      //notyf.error(notification);
      console.error(notification);
      break;
    }
  }
  throw new Error(msg);

}