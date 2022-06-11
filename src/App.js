import React, {Suspense} from "react";
import { routes } from './routing/mainRoutes';
import store from './redux/store'

import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom';

import { I18nProvider, LOCALES } from "./i18n";

import Api from "./Components/Api"
import Routing from "./Components/Routing";

import styles from './App.module.scss';

const setLanguage = () => {
    return localStorage.language ? JSON.parse(localStorage.getItem('language')) : 'UKRAINIAN';
};

const App = () => {
  const lang = LOCALES[setLanguage()]

  return (
      <div className={styles.block}>
          <I18nProvider locale={lang}>
              <Provider store={store}>
                  <Api/>
                  <BrowserRouter>
                      <Suspense
                          fallback={
                              <div className={styles.preloader}>Preloader</div>
                          }
                      >
                          <Routing {...{ routes }} />
                      </Suspense>
                  </BrowserRouter>
              </Provider>
          </I18nProvider>
      </div>
  )
}

export default App;
