import { DashboardGeneralPage } from './../dashboard-general/dashboard-general';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm

  constructor(public navCtrl: NavController, public fb: FormBuilder,public navParams: NavParams) {
    let EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEXP)])],
      password: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.clickLogin();
  }

  clickConfiguracion(){

  }

  clickLogin(){
    this.navCtrl.setRoot(DashboardGeneralPage);
  }



}
