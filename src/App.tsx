import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

import 'leaflet/dist/leaflet.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import MapPage from './pages/MapPage';
import { MapProvider } from './contexts/MapContext';
import PhotoAlbumPage from './pages/PhotoAlbumPage';
import ConfigurationPage from './pages/ConfigurationPage';
import { useEffect } from 'react';
import { initSqlLite } from './helper/StorageHelper';
import { Capacitor } from '@capacitor/core';

setupIonicReact();

const App: React.FC = () => {

  const init = async () => {
    if (Capacitor.isNativePlatform()) {
      await initSqlLite();
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <IonApp>
      <MapProvider>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/Map" exact={true}>
                <MapPage />
              </Route>
              <Route path="/Configuration" exact={true}>
                <ConfigurationPage />
              </Route>
              <Route path="/PhotoAlbum" exact={true}>
                <PhotoAlbumPage />
              </Route>
              <Route path="/" exact={true}>
                <Redirect to="/folder/Inbox" />
              </Route>
              <Route path="/folder/:name" exact={true}>
                <Page />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </MapProvider>
    </IonApp>
  );
};

export default App;
