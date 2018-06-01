import { Component, OnInit } from '@angular/core';
import { LmsService } from '../lms.service';

@Component({
  selector: 'app-newapp',
  templateUrl: './newapp.component.html',
  styleUrls: ['./newapp.component.scss']
})
export class NewappComponent implements OnInit {
  loader : boolean = false
  application = new Array()
  employee = new Array

  constructor( private lms:LmsService) {
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()

    this.lms.emitgetApplicationDetail.subscribe( r => {
      this.application = r
      console.log(this.application)
    })

    
    this.lms.emitgetEmployees.subscribe( r => {
      this.employee = r
       //console.log(this.employee)
    })

  }

  ngOnInit(){
    this.lms.getApplicationDetail()
    this.lms.getEmployees()
   }

}
