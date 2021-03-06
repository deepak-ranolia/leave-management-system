import { EventEmitter, Injectable } from '@angular/core'
import { ApiService } from './api.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'

import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'

const url = 'http://192.168.15.55:5000/lms/holiday'

@Injectable()
export class LmsService {
  loader : boolean = false
  emitsload = new EventEmitter<any>()
  emithload = new EventEmitter<any>()

  emitgetEmployees = new EventEmitter<any>() // Emit Employees
  emitLogin = new EventEmitter<any>() // Emit Login
  emitErr = new EventEmitter<any>() // Emit Err , not using right now
  emitEOL = new EventEmitter<any>() // Emit Employee On Leaves
  emitgetHoliday = new EventEmitter<any>()

  constructor( private api : ApiService, private router : Router, public snackBar : MatSnackBar, private http: HttpClient ){}
  
  // CSV Upload
  public upload( files: Set < File > ) : { [ key : string ] : Observable < number > } {
  const status = {}
    files.forEach( file => {
      const formData:FormData = new FormData()
      formData.append( 'file' , file , file.name )
      const req = new HttpRequest('POST', url , formData, {
        reportProgress : true
      })
      const progress = new Subject< number > ()
      this.http.request( req ).subscribe( event => {
        if ( event.type === HttpEventType.UploadProgress ) {
          const percentDone = Math.round( 100 * event.loaded / event.total )
          progress.next( percentDone )
        } else if ( event instanceof HttpResponse ) {
          progress.complete()
        }
      })
      status[ file.name ] = {
        progress:progress.asObservable()
      }
    })
    return status
  }
  showLoader() {
    this.loader = true
    this.emitsload.emit(this.loader)
    setTimeout(() => {
      this.hideLoader()
    }, 1000 )
  }
  hideLoader(){
    this.loader = false
    this.emithload.emit(this.loader)
  }
  snackBars( message:string, action:string ){  
    this.snackBar.open(message,action,{
      duration:2600,
    })
  }  
  isLogin() {
    if(localStorage.getItem('token')){
      this.router.navigate(['./'])
    }
  }
  login( uname:string, pwd:string ){
    let tmp : any
    tmp = { email : uname, password : pwd }
    let temp = JSON.stringify(tmp)
    this.api.Login(temp).subscribe(el => {
      // console.log(el)
      if ( el.success ){
        localStorage.setItem( 'token' , el.token )
        this.emitLogin.emit()
      } else this.snackBars("Success is false" , "Try again" )
    }, err => this.snackBars("API err" , "Contact back-end IT or try one more time" ) )
  }

  getEmployees(){
    this.api.GetEmployeeDetails().subscribe( el => {
      if ( el.success ) this.emitgetEmployees.emit(el.data)
      else this.snackBars( "Employee Success is false" , "Try again" ) // this.snackBar.open('el.success was not true')
    }, err => this.snackBars("API err" , "Contact back-end IT or try one more time" ) 
  )}
  getHoliday(){
    this.api.getHoliday().subscribe( el => {
      this.emitgetHoliday.emit(el.result)
    }, err => this.snackBars("API err" , "Contact back-end IT or try one more time" ) 
  )}
  addEmp( employee : any ) {
    this.api.addEmp(employee).subscribe( el => {
      // this.router.navigate(['/employee-list'])
      console.log(el)
      if ( el.success ) this.router.navigate(['/employee-list'])
      else this.snackBars( "Success is false" , "Try again" )
    }, err => this.snackBars( "API err" , "Contact back-end IT or try one more time" ) )
  }

  getEOL() {
    this.api.getEOL().subscribe( el => {
      if ( el.success ) this.emitEOL.emit( el.data )
      else this.snackBars( "leaveApplications Success is false" , "Try again" )
    }, err => this.snackBars( "API err" , "Contact back-end IT or try one more time" ) )  
  }

  updateEmployee( employee : any ) {
    //var temp = {employee : employee, uid : uid }
    this.api.updateEmployee(employee).subscribe( el => {
      if ( el.success == true ) {
        this.router.navigate(['/employee-list'])
        this.getEmployees()
      } else this.snackBars( "Not Updated" , "Try again" )
    }, err => this.snackBars( "API err" , "LMS updateEmployee" ) )
  }

  deleteEmp( qci_id : any ) {
    let tmp = { qci_id:qci_id }
    this.api.deleteEmp(tmp).subscribe( el => {
      if ( el.success == true ){
        this.getEmployees()
      } else this.snackBars( "Success is false" , "Try again" )
    }, err => this.snackBars( "API err" , "LMS deleteEmployee" ) )
  }

  postData( data : any ){
    this.api.postData(data).subscribe( el => {
      if ( el.success ){
        // this.getEmployees()
      } else this.snackBars( "Success is false" , "Try again" )
    }, err => this.snackBars( "API err" , "LMS deleteEmployee" ) )
  }

}
