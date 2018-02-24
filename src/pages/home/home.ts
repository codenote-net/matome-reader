import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform, private iab: InAppBrowser) {
  }

  openUrl(url: string) {
    this.platform.ready().then(() => {
      const browser = this.iab.create(url, '_system');
      browser.show();
    });
  }
}
