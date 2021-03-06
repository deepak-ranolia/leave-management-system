import { Component, OnInit } from '@angular/core';
import { LmsService } from '../../services/lms.service';
import * as moment from 'moment'
import * as _ from "lodash"

@Component({
  selector: 'app-newapp',
  templateUrl: './newapp.component.html',
  styleUrls: ['./newapp.component.scss']
})

export class NewappComponent implements OnInit {

  loader : boolean = false
  application = new Array()
  // employee = new Array()
  // t = new Array()
  constructor( private lms:LmsService ) {
  
    this.lms.emitsload.subscribe( el => this.loader = el )
    this.lms.showLoader()

    this.lms.emitEOL.subscribe( el => {
      for ( var i = 0; i < el.length; i++ ) {
        el[i].info.map( r => {
          var t = Object.assign( el[i], r )
          var prop = "info"
          delete el[i][prop]
          // el.filter( (i) => i != "info" )
        })
      }
      // console.log( el )
      this.application = el
      //this.t.map( el => console.log( el ) )
      // console.log( this.t )
    })
  
  }

  ngOnInit(){
    this.lms.getEOL()
  }
    
  // countSundays(){
  //   // Calculate sundays between two days using Moment JS
  //   var f = moment( this.firstDate ),
  //   s = moment( this.secondDate ),
  //   sunday = 0 // Sunday
    
  //   let result = []
  //   var current = f.clone()
    
  //   while ( current.day(7 + sunday).isBefore(s) ) {
  //     result.push( current.clone() )
  //   }

  //   // Calculate leavedays
  //   let totalDays = s.diff(f, 'days')
  //   let sundayCount = result.map( m => m ).length
  //   this.leavedays =  1 + totalDays - sundayCount
  // }
  
  // df(){
  //   var dateStart = moment(this.firstDate)
  //   var dateEnd = moment(this.secondDate)
  //   var timeValues = []

  //   while ( dateEnd > dateStart ) {
  //     timeValues.push( dateStart.format( 'YYYY-MM-DD' ) )
  //     dateStart.add( 1,'day' )
  //   }
  //   console.log( timeValues )
  // }
  
}
