//App ENV
export const ENV = {
    // @if NODE_ENV == 'DEV'
    apiEndpoint: 'https://ux_phase3.resustain.io',
    env: 'dev'
    // @endif

    // @if NODE_ENV == 'QA'
    apiEndpoint: 'https://qa.local.com/',
    env: 'qa'
    // @endif

    // @if NODE_ENV == 'PROD'
    apiEndpoint: 'https://prod.com/',
    env: 'prod'
    // @endif
// tslint:disable-next-line:eofline
};