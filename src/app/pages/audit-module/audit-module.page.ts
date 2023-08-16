import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
// import {GetdataService} from 'src/app/common/services/getdata.service'
import {DataService} from "src/app/data.service"

@Component({
  selector: 'app-audit-module',
  templateUrl: './audit-module.page.html',
  styleUrls: ['./audit-module.page.scss'],

})

export class AuditModulePage implements OnInit {
  collection : any=[];
  collection1 : any
  data1 : string
  // collection : Array<any> = [
  //   {data_pont:'data point 1',data:'dummy data for data 1'},
  //   {data_pont:'data point 2',data:'dummy data for data 2'},
  //   {data_pont:'data point 3',data:'dummy data for data 3'},
  //   {data_pont:'data point 4',data:'dummy data for data 4'},
  //   {data_pont:'data point 5',data:'dummy data for data 5'},
  //   {data_pont:'data point 6',data:'dummy data for data 6'},
  //   {data_pont:'data point 7',data:'dummy data for data 7'},
  //   {data_pont:'data point 8',data:'dummy data for data 8'},
  //   {data_pont:'data point 9',data:'dummy data for data 9'},
  //   {data_pont:'data point 10',data:'dummy data for data 10'},
  //   {data_pont:'data point11',data:'dummy data for data 11'},
  //   {data_pont:'data point 12',data:'dummy data for data 12'}
  // ]

  constructor(private dataservice : DataService)
  // (private router: Router,
  //   private http: HttpClient,)
  // private auditdata : GetdataService
  // ) {
  //   this.collection = auditdata.collection
  // }
  {
    // let dataService = new DataService()
    this.data1 = dataservice.name   
  }

  ngOnInit() {
    // this.fetchData()
    this.dataservice.getdata().subscribe((data: any) => {
      this.collection = data;
    },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  // dashboard(){
  //   this.router.navigate(['/dashboard'])
  // }
  // fetchData() {
  //   this.http.get('https://jsonplaceholder.typicode.com/posts').subscribe(
  //     (data: any) => {
  //       this.collection = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   );
  // }
}
