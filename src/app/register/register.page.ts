import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { FirebaseService } from '../services/firebase.service';
import * as CryptoJS from 'crypto-js';


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
      name: ['', [Validators.required]], 
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]], // Validar que no tenga espacios
      password: ['', [Validators.required, Validators.minLength(6)]], // Validar que tenga al menos 6 carácteres
      confirmPassword: ['', [Validators.required]], 
      birthDate: ['', [Validators.required]], 
    }, { validators: this.matchPasswords });
  }

  firebaseSvc = inject(FirebaseService);
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  ngOnInit() {
    // Verifica si los datos del usuario están en localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.router.navigate(['/home']);
    } 
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value; // Obtenemos el password del campo
    const confirmPassword = group.get('confirmPassword')?.value; // Obtenemos el comprobacion de pass
    return password === confirmPassword ? null : { passwordsMismatch: true }; // Comparamos ambos que sean exactamente iguaes
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  toUpperCase() {
    const name = this.registerForm.get('name'); // Obtenemos el nombre del campo
    if (name) {
      name.setValue(name.value.toUpperCase(), { emitEvent: false }); 
    }
  }

  get passwordsDoNotMatch() {
    return this.registerForm.hasError('passwordsMismatch') &&
      this.registerForm.get('confirmPassword')?.touched;
  }

  get email() { return this.registerForm.get('email'); }
  get user() { return this.registerForm.get('username'); }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  async register() {
    if (this.registerForm.valid) {
      const user: User = {
        uid: '',
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        username: this.registerForm.value.username,
        role: ''
      };

      this.firebaseSvc.signUp(user).then(async res => {

        let uid = res.user.uid;
        this.registerFirestore(uid);
      }).catch(error => {
        console.log(error);
      })
    }
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  async registerFirestore(uid: string) {
    if (this.registerForm.valid) {
      const password = this.registerForm.value.password;
      const encryptedPassword = CryptoJS.AES.encrypt(password, 'Brian12').toString();

      const user: User = {
        uid: uid,
        email: this.registerForm.value.email,
        password: encryptedPassword,
        username: this.registerForm.value.username,
        role: 'Admin' // Asignar el rol 'user'
      };

      const loading = await this.presentLoading('Accediendo');
      let path = `USERS/${uid}`;

      try {
        // Obtener el rol y permisos
        const rolePath = `ROLES/${user.role}`;
        const roleDoc = await this.firebaseSvc.getDocument(rolePath);
        if (roleDoc.exists) {
          const roleData = roleDoc.data();

          // Asignar permisos al usuario
          const userWithPermissions = {
            ...user,
            permissions: roleData?.['permissions'] || []
          };

          await this.firebaseSvc.setDocument(path, userWithPermissions);
          await this.firebaseSvc.updateUser(this.registerForm.value.name);

          alert('Registro exitoso');
          this.registerForm.reset();
          await loading.dismiss();
          this.router.navigate(['/login']);
        } else {
          console.log('Credencial invalida');
          await loading.dismiss();
        }
      } catch (error) {
        console.log('Error en el registro:', error);
        await loading.dismiss();
      }
    }
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent', // Se usa el spinner de carga predeterminado
      backdropDismiss: false,
      duration: 3000 // Para que no desaparezca automáticamente
    });

    // Añadir HTML personalizado dentro del loading
    const loadingElement = await loading.present();

    // Acceder al contenedor del loading para añadir la imagen y el texto
    const content = document.querySelector('.loading-content');
    if (content) {
      content.innerHTML = `
        <img src="/assets/logo.png" class="loading-image" alt="Logo-UTEQ">
        <div class="loading-text" style="display: flex; justify-content: center; text-align: center; 15px; color: #fff;">
            ${message}
        </div>
      `;
    }

    return loading;
  }

}
