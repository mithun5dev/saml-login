import { Injectable } from '@angular/core';
import { AppConstants } from '../../common/utility/constants';


@Injectable({
  providedIn: 'root'
})
export class IndicatorRecordUserAccessServiceService {

  constructor() { }

  getAllUsers = function () {
    var requestDetails = {
      url:  AppConstants.General.BASE_URL + '/users/all.json',
      method: 'GET'
    };
    //return PromiseFactory.generateHttpPromise(requestDetails);
  };

  /*this.getWorkflowById = function(workflowID) {
    var requestDetails = {
      url:  AppConstants.General.BASE_URL + '/workflows/' + workflowID + '.json',
      method: 'GET'
    };
    return PromiseFactory.generateHttpPromise(requestDetails);
  };

  this.getIndicatorRecordUserAccess = function(indicatorRecordId) {
    var requestDetails = {
      url:  AppConstants.General.BASE_URL + '/indicator_record_user_accesses/show_by_indicator_record_id.json',
      method: 'GET',
      params: {indicator_record_id: indicatorRecordId}
    };
    return PromiseFactory.generateHttpPromise(requestDetails);
  };

  this.createIndicatorRecordUserAccess = function(indicatorRecordUserAccesses) {
    var requestDetails = {
      url:  AppConstants.General.BASE_URL + '/indicator_record_user_accesses/create_many.json',
      method: 'POST',
      data: {indicator_record_user_accesses: indicatorRecordUserAccesses}
    };
    return PromiseFactory.generateHttpPromise(requestDetails);
  };

  this.createAuditUserAccess = function(indicatorRecordUserAccesses, indicatorRecordId) {
    var requestDetails = {
      url:  AppConstants.General.BASE_URL + '/audit_management/create_many_audit_user_accesses.json',
      method: 'POST',
      data: {
        indicator_record_user_accesses: indicatorRecordUserAccesses,
        indicator_record_id: indicatorRecordId}
    };
    return PromiseFactory.generateHttpPromise(requestDetails);
  };*/

}
