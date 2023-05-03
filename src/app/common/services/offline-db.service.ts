import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, combineLatest, Observable, observable,Observer } from 'rxjs';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class OfflineDbService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  currentUser: any = {};
  constructor(
    private platform: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    private httpBackend: HttpBackend
  ) {
    this.platform.ready().then(() => {
      //this.sqlite.deleteDatabase()
      this.sqlite.create({
        name: 'resustain.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.initializeDB();
        });
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  initializeDB() {
    this.http = new HttpClient(this.httpBackend);
    this.http.get('/assets/resustain.sql', { responseType: "text" })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            console.log("DB imported successfully----->");
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });

  }

  addCurrentUser(user_id, user_name, user_obj) {
    return this.checkUserExists(user_name).then((exists) => {
      if (!exists) {
        let data = [user_id, user_name, JSON.stringify(user_obj)];
        return this.database.executeSql('INSERT INTO current_user (user_id, user_name, user_obj) VALUES (?, ?, ?)', data).then(data => {
          //console.log("Record inserted successfully---->", data);
        }).catch(err => {
          //console.log("Error in record insertion----->", err);
        });
      } else {
        return this.getCurrentUser(user_name);
      }
    }).catch(err => {
      //console.log("Error in reading object---->", err);
    });
  }

  checkUserExists(email): Promise<any> {
    let user_exists = false;
    return this.database.executeSql('SELECT * FROM current_user WHERE user_name= ?', [email]).then(data => {
      //console.log("data rows length----.>", data.rows);
      if (data.rows.length > 0) {
        user_exists = true;
      }
      return user_exists;
    }).catch(error => {
      return user_exists;
    });
  }

  getCurrentUser(email): Promise<any> {
    //console.log(email);
    return this.database.executeSql('SELECT * FROM current_user WHERE user_name= ?', [email]).then(data => {
      //let currentUser = {};
      if(data && data.rows.length >0){
        if (data.rows.item(0).user_obj != '') {
          this.currentUser = JSON.parse(data.rows.item(0).user_obj);
        }
      }
      
      return this.currentUser;
    });
  }

  addAudits(auditsResObj) {
    //console.log("Audits Response object---->", auditsResObj);
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, auditsResObj['_id'], JSON.stringify(auditsResObj)];
    return this.database.executeSql("INSERT INTO audits (user_id,_id,audits_data) VALUES (?,?,?)", data).then(data => {
      //console.log("Record inserted successfully---->", data);
    }).catch(err => {
      //console.log("Error in record insertion----->", err);
    });
  }

  addActions(auditsResObj) {
    //console.log("Audits Response object---->", auditsResObj);
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, auditsResObj['_id'], JSON.stringify(auditsResObj)];
    return this.database.executeSql("INSERT INTO actions (user_id,_id,action_data) VALUES (?,?,?)", data).then(data => {
      //console.log("Record inserted successfully---->", data);
    }).catch(err => {
      //console.log("Error in record insertion----->", err);
    });
  }


  addIncidents(auditsResObj) {
    //console.log("Audits Response object---->", auditsResObj);
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, auditsResObj['_id'], JSON.stringify(auditsResObj)];
    return this.database.executeSql("INSERT INTO incidents (user_id,_id,audits_data) VALUES (?,?,?)", data).then(data => {
      //console.log("Record inserted successfully---->", data);
    }).catch(err => {
      //console.log("Error in record insertion----->", err);
    });
  }
  addIndicators(auditsResObj) {
    //console.log("Audits Response object---->", auditsResObj);
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, auditsResObj['_id'], JSON.stringify(auditsResObj)];
    return this.database.executeSql("INSERT INTO indicators (user_id,_id,audits_data) VALUES (?,?,?)", data).then(data => {
      //console.log("Record inserted successfully---->", data);
    }).catch(err => {
      //console.log("Error in record insertion----->", err);
    });
  }

  addProjects(auditsResObj) {
    //console.log("Audits Response object---->", auditsResObj);
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, auditsResObj['_id'], JSON.stringify(auditsResObj)];
    return this.database.executeSql("INSERT INTO projects (user_id,_id,audits_data) VALUES (?,?,?)", data).then(data => {
      //console.log("Record inserted successfully---->", data);
    }).catch(err => {
      //console.log("Error in record insertion----->", err);
    });
  }
  getAudits() {
    
    if(!this.currentUser){
     
      let val = localStorage.getItem('username');
      let email = '';
      if(val){
       email = val;
      }
      
      this.currentUser = this.getCurrentUser(email);
    
    
    }
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
      
    return this.database.executeSql('SELECT * FROM audits WHERE user_id = ? ' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    }).catch(err => {
      //console.log("Error in record retrieval----->", err);
    });
  }
  getActions() {
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM actions WHERE user_id = ? ' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).actions_data != '') {
        audits = JSON.parse(data.rows.item(0).action_data);
      }
      return audits;
    }).catch(err => {
      //console.log("Error in record retrieval----->", err);
    });;
  }
  getProjects() {
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM projects WHERE user_id = ? ' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }
  getIncidents() {
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM incidents WHERE user_id = ? ' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }

  getIndicators() {
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM indicators WHERE user_id = ? ' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }
  getUnits(): Observable<any> {
    return Observable.create((observer) => {
      this.database.executeSql('SELECT * FROM units_master ', []).then(data => {
        let units = [];
        if (data.rows.length > 0) {
          units = data.rows.item(0);
        }
        observer.next(units);
      }).catch(err => {
        observer.error(err);
      });
    });

  }

  saveUnitsData(units) {
        return this.database.executeSql('INSERT INTO units_master (units,tag) VALUES(?,?)', [JSON.stringify(units), 'units']).then(data => {
          //console.log("Units data inserted successfully--->", data);
          return data;
        }).catch(err => {
          //console.log("Error in saving units---->", err);
          return err;
        });
  }

  getComments(recordId) {
    return this.database.executeSql('SELECT * FROM comments WHERE entity_id=? ', [recordId]).then(data => {
      let comments = [];
      if (data.rows.length > 0 && data.rows.item(0).comments != '') {
        comments = JSON.parse(data.rows.item(0).comments);
      }
      return comments;
    });
  }

  saveComments(recordId, comments) {
    return this.getComments(recordId).then((res) => {
      if (res.length > 0) {
        return this.database.executeSql('UPDATE comments SET units=? WHERE entity_id=' + recordId, [JSON.stringify(comments)]).then(data => {
          //console.log("comments data updated successfully--->", data);
          return data;
        }).catch(err => {
          //console.log("Error in saving comments---->", err);
          return err;
        });
      } else {
        return this.database.executeSql('INSERT INTO comments (entity_id,comments) VALUES(?,?)', [recordId, JSON.stringify(comments)]).then(data => {
          //console.log("comments data inserted successfully--->", data);
          return data;
        }).catch(err => {
          //console.log("Error in saving comments---->", err);
          return err;
        });
      }
    }).catch(err => {
      //console.log("Error in reaind units from DB--->", err)
    })
  }

  addIndicatorDataEntry(indicator_id, indicatorObj, tag): Observable<any> {
    const data = [indicator_id, JSON.stringify(indicatorObj), tag];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO indicator_data_entry (_id,indicators,tag) VALUES (?,?,?)", data).then((res) => {
        //console.log("Indicator data entry inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding indicator data entry----->", err);
        observer.error(err);
      })
    });
  }

  getIndicatorDataEntry(indicator_id, tag: any = 'indicator'): Observable<any> {
    const dataTag = tag || 'indicator';
    const data = [indicator_id, dataTag];
    return new Observable((observerDE: any) => {

      this.database.executeSql("SELECT * FROM indicator_data_entry WHERE _id=? AND tag=?", data).then((res) => {
        //console.log("Indicator data entry ---->", res);
        let obj = {};
        if (res.rows.length > 0 && res.rows.item(0).indicators != '') {
          obj = JSON.parse(res.rows.item(0).indicators);
        }
        //return obj;
        observerDE.next(obj);
        observerDE.complete();
      }).catch(err => {
        //console.log("Error in reading indicator data entry----->", err);
        observerDE.error(err);
      })
    });
  }

  getIndicatorFromId(indicator_id, tag: any = 'indicator'): Observable<any> {
    const dataTag = tag || 'indicator';
    const data = [indicator_id, dataTag];
    return new Observable((observerId: any) => {

      this.database.executeSql("SELECT * FROM indicator_data_entry WHERE _id=? AND tag=?", data).then((res) => {
        //console.log("Indicator data entry ---->", res);
        let obj = {};
        if (res.rows.length > 0 && res.rows.item(0).indicators != '') {
          obj = JSON.parse(res.rows.item(0).indicators);
        }
        //return obj;
        observerId.next(obj);
        observerId.complete();
      }).catch(err => {
        //console.log("Error in reading indicator data entry----->", err);
        observerId.error(err);
      })
    });
  }

  addOrgNodes(indicator_id, orgNodes, tag): Observable<any> {
    const data = [indicator_id, JSON.stringify(orgNodes), tag];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO mapped_org_nodes (indicator_id,org_nodes,tag) VALUES (?,?,?)", data).then((res) => {
        //console.log("OrgNodes  inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding OrgNodes insertion----->", err);
        observer.error(err);
      });
    });
  }
  addSavedRecord(orgNodes, tag): Observable<any> {
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, JSON.stringify(orgNodes), tag];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO save_record_data (_id,indicator_record,tag) VALUES (?,?,?)", data).then((res) => {
        //console.log("OrgNodes  inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding OrgNodes insertion----->", err);
        observer.error(err);
      });
    });
  }

  updateRecord(orgNodes, tag, indicator_id): Observable<any> {
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, JSON.stringify(orgNodes), tag, indicator_id];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO update_record (_id,indicator_record,tag,indicator_id) VALUES (?,?,?,?)", data).then((res) => {
        //console.log("OrgNodes  inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding OrgNodes insertion----->", err);
        observer.error(err);
      });
    });
  }

  deleteRecord(record_id): Observable<any> {
    const user_id = this.currentUser['user_id'] || null;
    const data = [user_id, record_id];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO delete_record (_id,record_id) VALUES (?,?)", data).then((res) => {
        //console.log("OrgNodes  inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding OrgNodes insertion----->", err);
        observer.error(err);
      });
    });
  }

  getUpdatedRecords() {
    return this.database.executeSql('SELECT * FROM update_record').then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }

  getSavedRecords() {
    //const user_id = this.currentUser['user_id'] || null;
    //  const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM save_record_data').then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }
  getSavedRecordsDataList() {
    const user_id = this.currentUser['user_id'] || null;
    const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM save_record_data' + isNULLCheck, [user_id]).then(data => {
      let audits = {};
      if (data.rows.item(0).audits_data != '') {
        audits = JSON.parse(data.rows.item(0).audits_data);
      }
      return audits;
    });
  }
  getDeletedRecords() {
    //const user_id = this.currentUser['user_id'] || null;
    //  const isNULLCheck = (user_id == null) ? " OR user_id IS NuLL" : '';
    return this.database.executeSql('SELECT * FROM delete_record').then(data => {
      // let audits = {};
      // if (data.rows.item(0).audits_data != '') {
      //   audits = JSON.parse(data.rows.item(0).audits_data);
      // }
      // return audits;
      return data;
    });
  }

  getOrgNodes(indicator_id): Observable<any> {
    const data = [indicator_id];
    return Observable.create((observer) => {
      this.database.executeSql("SELECT * FROM mapped_org_nodes WHERE indicator_id=?", data).then((data) => {
        //console.log("Org Nodes Data ---->", data);
        let obj = {};
        if (data.rows.length > 0 && data.rows.item(0).org_nodes != '') {
          obj = JSON.parse(data.rows.item(0).org_nodes);
        }
        //return obj;
        observer.next(obj);
      }).catch(err => {
        //console.log("Error in reading Orgnodes----->", err);
        observer.error(err);
      })
    });
  }

  addPendingActions(indicator_id, pendingActions): Observable<any> {
    const data = [indicator_id, JSON.stringify(pendingActions)];
    return Observable.create((observer) => {
      this.database.executeSql("INSERT INTO pending_actions (indicator_id,actions) VALUES (?,?)", data).then((res) => {
        //console.log("PendingActions  inserted successfully---->", res);
        observer.next(res);
      }).catch(err => {
        //console.log("Error in adding PendingActions insertion----->", err);
        observer.error(err);
      });
    })
  }

  getPendingActions(indicator_id): Observable<any> {
    const data = [indicator_id];
    return Observable.create((observer) => {
      this.database.executeSql("SELECT * FROM pending_actions WHERE indicator_id=?", data).then((data) => {
        //console.log("Pending Actions ---->", data);
        let obj = {};
        if (data.rows.length > 0 && data.rows.item(0).actions != '') {
          obj = JSON.parse(data.rows.item(0).actions);
        }
        //return obj;
        observer.next(obj);
      }).catch(err => {
        //console.log("Error in reading Pending actions----->", err);
        observer.error(err);
      })
    });
  }


  saveIndicatorMappedData(indicator_id, indicators, mappedOrgNodes, pendingActions) {
    let arr = [];
    return new Promise((resolve, reject) => {
      const addIndicatorObservable = this.addIndicatorDataEntry(indicator_id, indicators, 'indicator');
      const addMappedOrdObservable = this.addOrgNodes(indicator_id, mappedOrgNodes, 'org_nodes');
      const addPendingActionsObservable = this.addPendingActions(indicator_id, pendingActions);
      combineLatest(addIndicatorObservable, addMappedOrdObservable, addPendingActionsObservable).subscribe(([res1, res2, res3]) => {
        arr = [res1, res2, res3];
        resolve(arr);
      }, err => {
        reject(err);
      });
    })

    //return arr;
  }

  checkRecordExists(indicator_id) {
    const param = [indicator_id];
    let record_exists = false;
    return this.database.executeSql("SELECT * FROM indicator_records WHERE indicator_id=?", param).then(data => {
      let records = {};
      if (data.rows.length > 0) {
        record_exists = true;
        return record_exists;
      }
      return record_exists;
    }).catch(err => {
      //console.log("Error in reading data from DB----->", err)
    })
  }

  addIndicatorRecords(indicator_id, indicator, indicator_records, count) {
    const data = [indicator_id, JSON.stringify(indicator), JSON.stringify(indicator_records), count];
    let self = this;
    return this.checkRecordExists(indicator_id).then(exists => {
      if (!exists) {
        return self.database.executeSql("INSERT INTO indicator_records(indicator_id,indicator,indicator_records,indicator_records_count) VALUES (?,?,?,?)", data).then(res => {
          //console.log("IndicatorRecords inserted successfully---->", res);
          return res;
        }).catch(err => {
          //console.log("Error in record insertion--->", err);
          return err;
        })
      } else {
        const updateObj = [JSON.stringify(indicator), JSON.stringify(indicator_records), count];
        return self.database.executeSql("UPDATE indicator_records SET indicator=?,indicator_records=?,indicator_records_count=? WHERE indicator_id='" + indicator_id + "'", updateObj).then(res => {
          //console.log("IndicatorRecords updated successfully---->", res);
          return res;
        }).catch(err => {
          //console.log("Error in record updation--->", err);
          return err;
        });
      }
    }).catch(err => {
      //console.log("Error in saveRecords method---->", err);
      return err;
    });
  }
  addRecord(indicator_id, indicator, indicator_records, count): Observable<any> {
    const updateObj = [JSON.stringify(indicator), JSON.stringify(indicator_records), count];
    return Observable.create((observer) => {
      this.database.executeSql("UPDATE indicator_records SET indicator=?,indicator_records=?,indicator_records_count=? WHERE indicator_id='" + indicator_id + "'", updateObj).then(res => {
        //console.log("IndicatorRecords updated successfully---->", res);
        observer.next(res);
        // observer.complete();
      }).catch(err => {
        //console.log("Error in reading Pending actions----->", err);
        observer.error(err);
      });
    });
  }
  // addRecord(indicator_id, indicator_records){
  //   const updateObj = [JSON.stringify(indicator_records)];
  //   return this.database.executeSql("INSERT INTO indicator_records(indicator_id,indicator,indicator_records,indicator_records_count) VALUES (?,?,?,?) WHERE indicator_id='"+indicator_id+"'",updateObj).then(res=>{
  //     //console.log("IndicatorRecords updated successfully---->",res);
  //     return res;
  //   }).catch(err=>{
  //     //console.log("Error in record updation--->",err);
  //     return err;
  //   });
  // }

  getIndicatorRecord(indicator_id, recordId): Observable<any> {
    const data = [recordId];
    //console.log("RecordId----->", recordId);
    return Observable.create((observer) => {
      this.database.executeSql("SELECT * FROM indicator_records WHERE indicator_id=?", [indicator_id]).then((res) => {
        if (res.rows.length > 0) {
          const indicatorRecords = JSON.parse(res.rows.item(0).indicator_records);
          let filteredIndicatorRecord = {};
          filteredIndicatorRecord = indicatorRecords.filter(obj => {
            return obj['_id'] == recordId;
          });
          //console.log("indicatorRecors---->", indicatorRecords);
          //console.log("filteredIndicatorRecord---->", filteredIndicatorRecord);

          observer.next(filteredIndicatorRecord[0]);
        }
      }).catch(err => {
        observer.error(err);
      });
    });
  }

  getIndicatorRecords(indicator_id): Observable<any> {
    //const param =[indicator_id];
    return Observable.create((observer) => {
      this.database.executeSql("SELECT * FROM indicator_records WHERE indicator_id=?", [indicator_id]).then((data) => {
        //console.log(" Indicator REcords ---->", data);
        let obj = {};
        //console.log(" Indicator REcords ---->", data.rows.length);
        if(data && data.rows.length >0){
          //console.log(" Indicator REcords inside if condition---->",data.rows.item(0));
          if (data.rows.item(0).indicator_records != '') {
            //console.log(" Indicator REcords inside if condition 2---->",data.rows.item(0));
            obj['indicator'] = JSON.parse(data.rows.item(0).indicator)
            obj['indicator_records'] = JSON.parse(data.rows.item(0).indicator_records);
            obj['indicator_records_count'] = data.rows.item(0).indicator_records_count;
          }
        }
        
        //return obj;
        observer.next(obj);
      }).catch(err => {
        //console.log("Error in reading Pending actions----->", err);
        observer.error(err);
      })
    });
  }

  loadFormData(indicator_id) {
    let arr = [];
    return new Promise((resolve, reject) => {
      const getIndicatorObservable = this.getIndicatorDataEntry(indicator_id);
      const getMappedOrdObservable = this.getOrgNodes(indicator_id);
      const getPendingActionsObservable = this.getPendingActions(indicator_id);
      const getIndicatorRecordsObservable = this.getIndicatorRecords(indicator_id);
      combineLatest(getIndicatorRecordsObservable, getIndicatorObservable, getMappedOrdObservable, getPendingActionsObservable)
        .subscribe(([indicatorRecords, indicatorData, orgNodes, actions]) => {
          arr = [indicatorRecords, indicatorData, orgNodes, actions];
          resolve(arr);
        }, err => {
          reject(err);
        });
    })
  }
   
  clearDb() {
    let sqlStr:string = 'DROP TABLE IF EXISTS units_master;DROP TABLE IF EXISTS system_users;DROP TABLE IF EXISTS current_user;DROP TABLE IF EXISTS audits;DROP TABLE IF EXISTS indicator_data;DROP TABLE IF EXISTS indicator_data_entry;DROP TABLE IF EXISTS incident_data; DROP TABLE IF EXISTS pending_actions;DROP TABLE IF EXISTS mapped_org_nodes;DROP TABLE IF EXISTS indicator_records;DROP TABLE IF EXISTS comments; DROP TABLE IF EXISTS projects;DROP TABLE IF EXISTS activities;DROP TABLE IF EXISTS save_record;'
     this.database.executeSql(sqlStr).then((res) => {
      //console.log(res);
    });
    // this.database.executeSql("DROP TABLE IF EXISTS units_master").then((res) => {
    //   //console.log(res);
    // })
    // this.database.executeSql("DROP TABLE IF EXISTS indicator_data_entry").then((res) => {
    //   //console.log(res);
    //   //  mapped_org_nodes
    // })
    // this.database.executeSql("DROP TABLE IF EXISTS  mapped_org_nodes").then((res) => {
    //   //console.log(res);
    //   // mapped_org_nodes
    // })
    // this.database.executeSql("DROP TABLE IF EXISTS  pending_actions").then((res) => {
    //   //console.log(res);
    //   //  mapped_org_nodes
    // })

    // this.database.executeSql("DROP TABLE IF EXISTS  audits").then((res) => {
    //   //console.log(res);
    //   //  mapped_org_nodes
    // });

    // this.database.executeSql("DROP TABLE IF EXISTS  indicators").then((res) => {
    //   //console.log(res);
    //   //  mapped_org_nodes
    // });
    // this.database.executeSql("DROP TABLE IF EXISTS  save_record").then((res) => {
    //   //console.log(res);
    //   //  mapped_org_nodes
    // });

  }
  clearSaveData() {
    this.database.executeSql("DROP TABLE IF EXISTS  save_record").then((res) => {
      //console.log(res);
      //  mapped_org_nodes
    });
  }
}
