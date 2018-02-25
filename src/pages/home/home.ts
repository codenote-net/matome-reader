import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SafariViewController } from '@ionic-native/safari-view-controller';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform,
    private iab: InAppBrowser, private safariViewController: SafariViewController) {
  }

  openUrl(url: string) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.safariViewController.isAvailable()
        .then((available: boolean) => {
          if (available) {
            this.safariViewController.show({
              url: url,
            })
              .subscribe((result: any) => {
                if (result.event === 'opened') console.log('Opened');
                else if (result.event === 'loaded') console.log('Loaded');
                else if (result.event === 'closed') console.log('Closed');
              },
              (error: any) => console.error(error)
              );
          } else {
            this.openUrlWithFallbackBrowser(url);
          }
        }
      );
    } else {
      this.openUrlWithFallbackBrowser(url);
    }
  }

  openUrlWithFallbackBrowser(url: string) {
    // use fallback InAppBrowser
    this.platform.ready().then(() => {
      const browser = this.iab.create(url, '_system');
      browser.show();
    });
  }

}
