import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromiseServiceService {

  constructor() { }

   // this is a fix to send array values in get query parameters
  //  fixParamsForArrays(params){
  //   if(!params) return {};

  //   var newParams = {};
  //   _.each(params, function(val, key) {
  //     if(_.isArray(val)){
  //       newParams[key + "[]"] = val;
  //     }
  //     else {
  //       newParams[key] = val;
  //     }
  //   })

  //   return newParams;
  // }

  /*generateHttpPromise = function (requestDetails) {
    var deferred = $q.defer();

    if(_.contains(['get', 'GET'], requestDetails.method)) {
      requestDetails.params = this.fixParamsForArrays(requestDetails.params);
    }

    $http(requestDetails).success(function (data, status, fnc, httpObj) {
      deferred.resolve(data, status, fnc, httpObj);
    }).error(function (data, status, fnc, httpObj) {
      var errorResponse = {
        data: data,
        status: status
      };
      deferred.reject(errorResponse);
    });

    return deferred.promise;
  };*/

}
