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

  constructor( private lms:LmsService) {
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()

    this.lms.emitgetApplicationDetail.subscribe( r => {
      this.application = r
      console.log(this.application)
    })
  }

  ngOnInit(){
    this.lms.getApplicationDetail()
   }

}
