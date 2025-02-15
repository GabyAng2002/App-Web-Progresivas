import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  users: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private loadingController: LoadingController) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validar que ingrese este campo y que sea un correo válido
      fullName: ['', [Validators.required]], // Validar que ingrese este campo
      user: ['', [Validators.required, Validators.pattern(/^\S*$/)]], // Validar que no tenga espacios
      password: ['', [Validators.required, Validators.minLength(6)]], // Validar que tenga al menos 6 carácteres
      confirmPassword: ['', [Validators.required]], // Validar que ingrese este campo
      birthDate: ['', [Validators.required]], // Validar que ingrese este campo
    }, { validators: this.matchPasswords });
  }

  ngOnInit() {
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value; // Obtenemos el password del campo
    const confirmPassword = group.get('confirmPassword')?.value; // Obtenemos el segundo password
    return password === confirmPassword ? null : { passwordsMismatch: true }; // Comparamos ambos que sean exactamente iguaes
  }

  toUpperCase() {
    const fullName = this.registerForm.get('fullName'); // Obtenemos el nombre del campo
    if (fullName) {
      fullName.setValue(fullName.value.toUpperCase(), { emitEvent: false }); // Lo converttimos a mayúsculas
    }
  }

  get passwordsDoNotMatch() {
    return this.registerForm.hasError('passwordsMismatch') &&
      this.registerForm.get('confirmPassword')?.touched;
  }

  get email() { return this.registerForm.get('email'); }
  get user() { return this.registerForm.get('user'); }
//Author: LAURA GABRIELA ANGUIANO PINEDA
  async register() {
    if (this.registerForm.valid) {
      
      const loading = await this.presentLoading('Registrando...');

      setTimeout(async () => {
        this.users.push(this.registerForm.value);
        console.log('Datos del usuario:', this.registerForm.value);
        alert('Registro exitoso');

        this.registerForm.reset();
        await loading.dismiss(); // Cerrar  spinner

        this.router.navigate(['/login']);
      }, 3000); 
      // Simulación de carga de 3 segundos
    }
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent', // Se usa el spinner de carga predeterminado
      backdropDismiss: false,
      duration: 0 // Para que no desaparezca instantaneamente
    });

    // Añadir HTML personalizado dentro del loading
    const loadingElement = await loading.present();

    // Modificar instancia
    const content = document.querySelector('.loading-content');
    if (content) {
      content.innerHTML = `
        <img src="/assets/Logo.png" class="loading-image" alt="Logo-UTEQ">
        <div class="loading-text" style="display: flex; justify-content: center; text-align: center; 15px; color: #fff;">
            ${message}
        </div>
      `;
    }

    return loading;
  }

}