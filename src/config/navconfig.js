// navConfig.js
export const NAV_ITEMS = [
  {
    label: 'Home',
    path: '/',
    hideOn: []
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    hideOn: ['/dashboard']
  },
  {
    label: 'Upload Resume',
    path: '/upload',
    hideOn: ['/upload']
  },
  {
    label: 'Job Description',
    path: '/job',
    hideOn: ['/job']
  },
  {
    label: 'Matches',
    path: '/matches',
    hideOn: ['/matches']
  },
  {
    label: 'Gap Analysis',  
    path: '/gap-analysis',
    hideOn: ['/gap-analysis']
  }
];
