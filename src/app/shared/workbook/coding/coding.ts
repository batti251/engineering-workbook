import { Component, inject } from '@angular/core';
import { Login } from '../../components/login/login';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-coding',
  imports: [Login],
  templateUrl: './coding.html',
  styleUrl: './coding.scss',
})
export class Coding {
  route = inject(ActivatedRoute)
  ngOnInit(){
    
  }
}

