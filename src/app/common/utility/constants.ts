import { ENV } from '../../../config/env';

// tslint:disable-next-line:no-namespace
export namespace AppConstants
{
    export class General{
        // BASE_URL = 'https://tatatrain.resustain.io';
        // BASE_URL = 'http://192.168.1.156:3000';
        // public static readonly BASE_URL = '/v1';
        public static readonly BASE_URL = ENV.apiEndpoint;
        public static readonly DATE_FORMAT = 'dd MMMM, yyyy';
        public static readonly DEBUG = false;
        public static readonly PROJECT = true;
        public static readonly AUDIT = true;
        public static readonly INCIDENT = true;
        public static LOGIN_ID = '';
    }

}
