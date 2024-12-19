import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = 'duartedx10@gmail.com';
  password: string = '123';
  authMode: string = 'login';

  constructor(private router: Router) {}

  onLogin() {
    if (!this.email || !this.password) {
      console.log('Por favor, preencha todos os campos!');
      return;
    }
  
    // Simular uma verificação simples (substituir com autenticação real depois)
    if (this.email === 'duartedx10@gmail.com' && this.password === '123') {
      this.router.navigate(['/home']); // Redireciona para a página principal
    } else {
      console.log('Email ou password incorretos!');
    }
  }
  

  onSignUp() {
    console.log('Funcionalidade de registo ainda não implementada.');
  }
}
