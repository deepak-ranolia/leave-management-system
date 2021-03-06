import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LmsService } from '../../../services/lms.service';

// import * as _ from "lodash"

@Component({
  selector: 'app-edit-emp',
  templateUrl: './edit-emp.component.html',
  styleUrls: ['./edit-emp.component.scss']
})
export class EditEmpComponent implements OnInit {
  employee : any = new Object()
  uid : any
  key : any
  gender : any
  show : boolean = false
  hide : boolean = false

  loader : boolean = false
  
  constructor( private route:ActivatedRoute, private router:Router, private lms:LmsService ) {
    
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()
    
    this.uid = this.route.snapshot.paramMap.get('id')
    this.lms.emitgetEmployees.subscribe( r => {
      let arr = Object.values(r)
      var item = arr.find( it => it.qci_id == this.uid )
      this.employee = item
      this.employee.password = null
      // var skey = _.findKey( r, this.employee )
      // this.key = skey
      if ( this.employee.gender == 'Male' ) {
        this.hide = true
        this.show = false
      }
      else if ( this.employee.gender == 'Female' ) {
        this.show = true
        this.hide = false
      }
    })
  }

  ngOnInit() {
    this.lms.getEmployees()
  }
  
  updateEmployee(){
    this.lms.updateEmployee(this.employee)
  }
}
