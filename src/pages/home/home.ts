import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { AngularFirestore } from 'angularfire2/firestore';
import { Query } from '@firebase/firestore-types'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  articles: BehaviorSubject<any[]> = new BehaviorSubject([]);
  currentCursor: any;

  constructor(public navCtrl: NavController, public platform: Platform,
    private iab: InAppBrowser, private safariViewController: SafariViewController,
    private db: AngularFirestore) {
  }

  ionViewWillEnter() {
    this.fetchArticles();
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

  doInfinite(infiniteScroll) {
    const cursor = this.getCursor();

    // Fetch articles if cursor was updated
    if (this.currentCursor !== cursor) {
      this.currentCursor = cursor;
      this.fetchArticles(cursor);
    }

    infiniteScroll.complete();
  }

  private fetchArticles(cursor?) {
    this.db.collection('latestArticles', ref => {
      let query: Query = ref;

      query = query
        .orderBy('publishedDate', 'desc')
        .limit(10);

      if (cursor) {
        query = query.startAfter(cursor);
      }

      return query;
    })
    .valueChanges()
    .subscribe(articles => {
      const current = this.articles.getValue();
      this.articles.next(_.concat(current, articles));
    });
  }

  // Determines the specified field's value of the last doc to paginate query
  private getCursor() {
    const current = this.articles.getValue();
    if (current.length) {
      return current[current.length - 1].publishedDate;
    }
    return null;
  }
}
