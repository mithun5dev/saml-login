import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  name = "bhanuprakash"
  storage : any
  constructor(private http?: HttpClient) { 
  

  }

  ngOnInit() {
    //this.getdata()
  }

  getdata(){
    return this.http.get('https://tatatest.resustain.io/audit_management.json')
  }

}
