import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cloudacclerator',
  templateUrl: './cloudacclerator.component.html',
  styleUrls: ['./cloudacclerator.component.css']
})
export class CloudaccleratorComponent {
  bookingDetailsList:any=[
    {
      zonename:'BluZAP',
      link:'bluzap'
    },
    {
      zonename:'OptiCos',
      link:'opticos'
    },
    {
      zonename:'Ruppels',
      link:'ruppels'
    },
    {
      zonename:'Swift MI',
      link:'swiftmi'
    },
    {
      zonename:'TerrGen2',
      link:'terrgen2'
    },
  ]
  constructor(private router :Router) { }

  ngOnInit(): void {
  }
  navigateComponent(item:any){
    this.router.navigate([item.link])
  }
}