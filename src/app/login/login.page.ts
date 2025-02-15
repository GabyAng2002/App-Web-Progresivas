import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isValid: boolean = false;

  constructor(private modalController: ModalController, private router: Router, private loadingController: LoadingController) { }

  acces = [
    { username: 'admin', password: '1234' },
    { username: 'gaby', password: '1234' }
  ];

  validarCampos() {
    this.username = this.username.replace(/\s+/g, '').toLowerCase(); //Se encarga de remplazar mayúsculas por minúsculas y no aceptar espacios
    this.password = this.password.replace(/\s+/g, ''); //Igualmente no acepta espacios

    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        username: this.username,
        password: this.password,
      },
    });
    return await modal.present();
  }
 //Author: LAURA GABRIELA ANGUIANO PINEDA
  acceder() {
    const usuarioEncontrado = this.acces.find(user => 
      user.username === this.username && user.password === this.password
    );
  
    if (usuarioEncontrado) {
      this.presentLoading('Entrando', () => {
        this.router.navigate(['/home']); 
      });
    } else {
      alert('Datos incorrectos');
    }
  }
 //Author: LAURA GABRIELA ANGUIANO PINEDA
  // Función reutilizable para mostrar un Loading
  async presentLoading(mensaje: string, callback: Function) {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000 // 3 segundos
    });
    await loading.present();
    await loading.onDidDismiss();
    callback(); // Ejecuta la función después del loading
  }
}