import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';
import { LoadingController } from '@ionic/angular';
// import {AuditModulePage} from 'src/app/pages/audit-module/audit-module.page'
@Component({
  selector: 'app-record-listing',
  templateUrl: './record-listing.page.html',
  styleUrls: ['./record-listing.page.scss'],
})
export class RecordListingPage implements OnInit {
  collection : any = []
  currentPage : any = 1
  name : any
  id : any
  constructor(private route : ActivatedRoute,
    private dataserve : DataService,
    private lodingCtrl : LoadingController
) { }
 
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('indicator_id');
    console.log(this.id)
    this.getdata()
    // const currentPage : any = 1
    // this.dataserve.getRecord_listing(this.id).subscribe(data => {
    //   console.log('the data record' , data)
    //   this.name = data                                              //this is used to fetch the data with out infinate scrool
    //   this.collection = data
    //   // this.collection.push()
    //   this.collection = this.collection.indicator_records
    //   console.log(this.collection)
  // })
  }


 
  async getdata(event?){

    const loading = await this.lodingCtrl.create({
      message: 'Loading..',
      spinner: 'bubbles',
    });

     await loading.present();

    this.dataserve.getRecord_listing(this.id, this.currentPage).subscribe(data => {
    console.log('the data record' , data)
    loading.dismiss();
    this.name = data
    this.collection.push(...(this.name.indicator_records));
    console.log(this.collection)     

    event?.target.complete();
     if (event) {
      event.target.disabled = Math.ceil(this.name.indicator_records_count/20) === this.currentPage;
       }
},
(err) => {
  console.log(err);
   loading.dismiss();
}
)}

    loadmore(event:any){
    this.currentPage++
    console.log(this.currentPage)
    this.getdata(event)
  }
  
}
