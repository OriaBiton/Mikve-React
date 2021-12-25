import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';

import Header from './components/Header';
import Nav from './components/Nav';
import Container from './components/Container';
import Loading from './components/Loading';
import Auth from './components/Auth/Auth';
import Settings from './components/Settings';
import Home from './components/Home';
import ChooseMikve from './components/ChooseMikve';
import ChooseTime from './components/ChooseTime';

export default function App(){
  return (
    <BrowserRouter>
      <Header />
      <AuthProvider>
        <Nav />
        <Container>
          <LoadingProvider>
            <Loading />
            <Auth />
            <AppointmentProvider>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/settings' component={Settings} />
                <Route path='/choose-mikve' component={ChooseMikve} />
                <Route path='/time' component={ChooseTime} />
              </Switch>
            </AppointmentProvider>
          </LoadingProvider>
        </Container>
      </AuthProvider>
    </BrowserRouter>      
  );
}
