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

  ngOnInit(): void {
    this.getdata()
  }

  getdata(){
    return this.http.get('https://jsonplaceholder.typicode.com/posts')
  }

}
