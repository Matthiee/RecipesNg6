import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Credentials } from '../credentials.model';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  inflight: boolean = false;

  constructor(private auth: AuthService, private toast: NotifierService) { }

  ngOnInit() {
  }

  onLogIn(form: NgForm) {
    this.inflight = true;

    const email = form.value.email;
    const password = form.value.password;

    const creds = new Credentials(email, password);

    this.auth.loginUser(creds).pipe(first()).subscribe(
      () => {

        this.toast.notify('success', 'logged in');

      },
      () => { },
      () => this.inflight = false);

  }

}
