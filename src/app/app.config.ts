import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {NgcCookieConsentConfig, provideNgcCookieConsent} from 'ngx-cookieconsent';


export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain: 'localhost:4200'
  },
  palette: {
    popup: {
      background: '#000'
    },
    button: {
      background: '#f1d600'
    }
  },
  theme: 'edgeless',
  type: 'info',

  content: {
    header: 'Cookie Consent',
    message: 'This website uses cookies to ensure you get the best experience on our website and to analyze traffic in accordance with GDPR regulations.',
    dismiss: 'Got it!',
    allow: 'Accept all',
    deny: 'Decline',
    link: 'Learn more',
    href: 'https://github.com/DmytroSav4uk/MazeRunnerGame/blob/master/PRIVACY.md',
    policy: 'Cookie Policy'
  }

};


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideNgcCookieConsent(cookieConfig)
  ]
};
