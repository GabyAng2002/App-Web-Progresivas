import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: any; // Guardará los datos del usuario
  token: string = '';
  mensaje: boolean = false;
  mostrarInfoUsuario: boolean = false;
  mostrarAdminOpciones: boolean = false;

  constructor(private router: Router) { }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  ngOnInit() {
    // Verifica si los datos del usuario están en localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      this.user = JSON.parse(storedUser); // Convierte el string JSON de nuevo en objeto
      this.token = storedToken; // Asigna el token a una variable para su uso
    } else {
      // Si no existe el usuario en localStorage, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  info() {
    this.mensaje = true;
    setTimeout(() => {
      this.mensaje = false;
    }, 5000);
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  login() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      console.log('Ya tienes una sesión activa.');
      return; // Evita la navegación si ya está autenticado
    }
    this.router.navigate(['/login']);
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  logout() {
    localStorage.removeItem('user'); 
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); 
    });
  }

  toggleUserInfo() {
    this.mostrarInfoUsuario = !this.mostrarInfoUsuario;
  }

  toggleAdminOptions() {
    this.mostrarAdminOpciones = !this.mostrarAdminOpciones;
  }
  //Author: LAURA GABRIELA ANGUIANO PINEDA
  verUsuarios() {
    console.log('Ver usuarios');
  }

  agregarUsuario() {
    console.log('Agregar usuario');
  }

  eliminarUsuario() {
    console.log('Eliminar usuario');
  }

}
