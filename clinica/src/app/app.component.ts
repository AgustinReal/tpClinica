import { Component } from '@angular/core';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { slideInAnimation } from './animaciones';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'clinica';

  constructor(private contexts: ChildrenOutletContexts){

  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
