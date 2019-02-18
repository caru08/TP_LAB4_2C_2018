import { Component, HostBinding, Input, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FadeTransition } from './animations'

@Component({
  selector: "circle-loader",
  templateUrl: 'circle-loader.component.html',
  styleUrls:['./circle-loader.component.scss'],
  animations: [FadeTransition(.3)],
  inputs: ['loading', 'smallSpinner'],
})
export class CircleLoaderComponent implements OnInit, OnChanges {

 //all utilizar el SMALL SPINNER se debe colocar la clase small-circle-loader-container en el contenedor del mismo


  @Input() loading: boolean = false;
  @Input('small-spinner') smallSpinner: boolean = false;

  @HostBinding('style.display') display: string = 'none';

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(){
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!changes["loading"]) {
      this.loading = false;
    }
  }

  animationEnd(){
    // https://github.com/angular/angular/issues/17572
    this.display = this.loading ? "block" : 'none';
  }
}
