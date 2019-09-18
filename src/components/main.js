import React from 'react'
import {Switch,Route} from 'react-router-dom';
import LocalLive from './WebRTC/localVideo'
import WatchLive from './WebRTC/watchLive'

const main = () => (
    <Switch>
      <Route exact path="/locallive" component={LocalLive}/>
      <Route exact path="/watchlive" component={WatchLive}/>
    </Switch>
);


export default main;