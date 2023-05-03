import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ConditionService } from './condition.service';
import { AppConstants } from '../utility/constants';

@Injectable({
  providedIn: 'root'
})
export class DataEntryHelpersService {
  dynamicAttrs: any = [];
  sections: any = [];
  userSectionAccesses: any;
  data_frequency = {
    30: 1,
    90: 3,
    180: 6,
    365: 12
  };
  constructor(private conditionService: ConditionService,
    ) { }

  sortSectionAttributes(indicatorData, rejectAttrType) {
    let sectionsArr = [];
    this.dynamicAttrs = indicatorData.indicator_attributes_attributes;

    // tslint:disable-next-line:only-arrow-functions
    this.dynamicAttrs = _.reject(this.dynamicAttrs, function (attr) {
      return rejectAttrType.indexOf(attr.attribute_type) > -1;
    });

    // tslint:disable-next-line:only-arrow-functions
    const sections = _.map(this.dynamicAttrs, function (attr) {
      return attr.indicator_section;
    });

    // sectionsArr = _.uniqBy(sections, ['_id']);
    // sections are not sort by server
    sectionsArr = _.sortedUniqBy(sections, '_id');
    //   sectionsArr = _.sortedUniqBy(sections, function(section){
    //    return section._id
    //  })
    return sectionsArr;
  }

  evaluateSectionCondition(sectionId, index) {
    if (typeof sectionId === 'undefined') { return false; }

    const verdict = this.conditionService.evaluateCondition(sectionId);
    return verdict;
  }
  nestedRecordAdded(attribute, record) {
    var verdict = _.find(record.action_records_attributes, function (action_record) {
      return action_record.attribute_id === attribute._id;
    });
    return verdict != undefined;
  }
  setOrgNodeName(orgNodes, formData) {
    let orgNode = _.find(orgNodes, function (orgNode) {
      return orgNode._id == formData.org_node_id;
    });
    if (orgNode == undefined) return;
    return formData['org_node_name']=orgNode.name;
  }

  changeDateFormat(indicator, indicatorRecord, thisRef: any = {}) {
    var fields = ['start_date', 'end_date']
    var dateAttr = _.filter(indicator.indicator_attributes_attributes, { control_type: 'date' });

    var dateFields = dateAttr.map(function (attr) { return attr.name })
  }

  changeToNumber(indicator, indicatorRecord) {

    var numAttr = _.filter(indicator.indicator_attributes_attributes, function (attr) {
      return attr.attribute_type == 'number' || attr.attribute_type == 'unit';
    });

    var numFields = numAttr.map(function (attr) { return attr.name })

    // angular.forEach(numFields, function(field) {
    //   if(_.isString(rec[field])) rec[field] = parseFloat(rec[field]);
    // })
  }
  setEndDate(formData, indicator) {
    /*if (typeof formData.start_date == 'undefined') return;

    if (indicator.data_frequency.name == 'Ad hoc') {
      return formData.end_date = $filter('date')(formData.start_date, AppConstants.General.DATE_FORMAT)
    } else {
      var endDate = new Date(formData.start_date);

      if (indicator.data_frequency.value < 30) {
        endDate.setDate(endDate.getDate() + parseInt(indicator.data_frequency.value));
      } else {
        var addMonth = this.data_frequency[indicator.data_frequency.value];
        endDate.setMonth(endDate.getMonth() + addMonth);
      };

      endDate.setDate(endDate.getDate() - 1);
      return formData.end_date = $filter('date')(endDate, AppConstants.General.DATE_FORMAT);
    }*/
  }
  filterNoUiAttrs(attr, index, array) {
    //return !_.contains(['formula'], attr.attribute_type)
  }

  convertValue(form_data, field, units) {

    if(form_data[field + '___unit_id'] == undefined)
      form_data[field + '___unit_id'] =
          form_data[field + '__unit_id'];

    var unit = _.find(units,function(rw){ return rw._id
                      == form_data[field + '___unit_id'] });
    var conversion_factor1 = unit.conversion;

    unit = _.find(units,function(rw){ return rw._id
                      == form_data[field + '__unit_id'] });
    var conversion_factor2 = unit.conversion;

    var value = form_data[field];

    form_data[field] =
        value * (conversion_factor2/conversion_factor1);

    form_data[field + '___unit_id'] =
        form_data[field + '__unit_id'];
  }

  setAuditUserSectionAccesses(userSectionAccesses) {
    this.userSectionAccesses = userSectionAccesses;
  }
  getAuditUserSectionAccesses() {
    return this.userSectionAccesses;
  }
  /*changeSaveDateFormat (indicator, indicatorRec){
    let self= this;
    return _.each(indicator.indicator_attributes_attributes, function(attr) {
      if (attr.attribute_type == 'date' && indicatorRec[attr.name] != 'Invalid Date'){
        indicatorRec[attr.name] = self.datePipe.transform()
       // $filter('date')(indicatorRec[attr.name], 'yyyy-MM-dd');
      }
      indicatorRec['start_date'] = $filter('date')(indicatorRec['start_date'], DATE_FORMAT);
    });
  }*/

}
