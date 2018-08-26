import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Credentials } from '../credentials.model';
import { first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  inflight: boolean = false;

  constructor(private auth: AuthService, private toast: NotifierService) { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {

    this.inflight = true;

    const email = form.value.email;
    const password = form.value.password;

    const creds = new Credentials(email, password);

    this.auth.signupUser(creds)
      .pipe(first())
      .subscribe(() => {

        this.inflight = false;

        this.toast.notify('success', 'logged in');

      });

  }

}
