import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {
  name = "bhanuprakash"
  storage : any
  current_page : number = 1
  constructor(private http?: HttpClient) { 
  }

  ngOnInit() {
    //this.getdata()
  }

  getdata(){
    return this.http.get('https://tatatest.resustain.io/audit_management.json')
  }

  getRecord_listing(id:string,page:any ){
    return this.http.get(`https://tatatest.resustain.io/indicator_data/indicator_records.json?indicator_id=${id}&limit=20&page=${page}`)
  }
  // https://tatatest.resustain.io/indicator_data/indicator_records.json?indicator_id=5cfa0bc7098f6b2c9b000a74&limit=20&page=1
  // `https://tatatest.resustain.io/indicator_data/indicator_records.json?indicator_id=${id}`
}
