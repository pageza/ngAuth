import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: any = false;
  authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      () => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm): void {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
