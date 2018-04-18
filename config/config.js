PackageName
.config(function($stateProvider, $urlRouterProvider,cfpLoadingBarProvider, ngToastProvider, $httpProvider, $provide, ngIntlTelInputProvider) {
  $urlRouterProvider.otherwise("/login");


  ngToastProvider.configure({
    additionalClasses: 'ng-toast-animate',
    'combineDuplications': true,
  })

   
    ngIntlTelInputProvider.set({
          initialCountry: 'my',
          utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.4/js/utils.js'
        });


  $stateProvider

            // ------------------------------
            // Main page load  
            // ------------------------------
            .state('admin', {
             url: '/admin',
             templateUrl: 'views/admin.html'
           })

            // ------------------------------
            // Dashboard  
            // ------------------------------
            .state('admin.dashboard', {
             url: '/dashboard',
             templateUrl: 'views/dashboard.html',
             controller: 'dashboardCtrl'
           })

            // ------------------------------
            // Candidate listing 
            // ------------------------------

            .state('admin.candidate', {
              url: '/candidate?job_id=',
              params: {
                job_id: null,
              },
              templateUrl: 'views/candidate/candidate.html',
              controller: 'candidateCtrl'

            })

            // ------------------------------
            // View Candidate 
            // ------------------------------
            .state('admin.view-candidate', {
              url: '/view-candidate?job_id=?cat=?candidate_id=',
              params: {
                job_id: null,
                candidate_id: null,
                cat: null,
              },
              templateUrl: 'views/candidate/view-candidate.html',
              controller: 'viewCandidateCtrl'

            })


            // ------------------------------
            // Template -- to be removed at the end  
            // ------------------------------
            .state('admin.template', {
              url: '/template',
              templateUrl: 'views/template.html',
              controller: 'templateCtrl'

            })
            
            // ------------------------------
            // Login
            // ------------------------------
            .state('login', {
              url: '/login',
              templateUrl: 'views/login/login.html',
              controller: 'loginCtrl'
            })

            // ------------------------------
            // Sign up Success
            // ------------------------------
            .state('registration-success', {
              url: '/registration-success?email=',
              params: {
                email: null,
              },
              controller: 'registrationSuccessCtrl',
              templateUrl: 'views/login/registration-success.html'
            })

            // ------------------------------
            // Registrationverification
            // ------------------------------
            .state('verify', {
              url : '/verify?token=',
              params: {
                token: null,
              },
              controller : 'verification',
              templateUrl: 'views/login/registration-verification.html',

            })
            // ------------------------------
            // Forgot password
            // ------------------------------
            .state('forgot-password', {
              url : '/forgot-password',
              controller : 'forgotPassword',
              templateUrl: 'views/login/forgot-password.html',

            })
            // ------------------------------
            // Reset password
            // ------------------------------
            .state('reset-password', {
              url : '/reset-password?token=',
              params: {
                token:null,
              },
              controller : 'resetPassword',
              templateUrl: 'views/login/reset-password.html',

            })
            // ------------------------------
            // Profiles 
            // ------------------------------
            .state('admin.profile', {
              url : '/profile',
              controller : 'profileCtrl',
              templateUrl: 'views/profile/profile.html',

            })
            // ------------------------------
            // Jobs - post job
            // ------------------------------
            .state('admin.post-job', {
              url : '/post-job',
              controller : 'postJobCtrl',
              templateUrl: 'views/jobs/post-job.html',

            })

            // ------------------------------
            // Job list 
            // ------------------------------
            .state('admin.job-lists', {
              url : '/job-lists',
              controller : 'jobListsCtrl',
              templateUrl: 'views/job-lists/job-lists.html',

            })

            // ------------------------------
            // Anaytics
            // ------------------------------
            .state('admin.analytics', {
              url : '/analytics',
              controller : 'analyticsCtrl',
              templateUrl: 'views/analytics/analytics.html',

            })

            // ------------------------------
            // Campaign
            // ------------------------------
            .state('admin.campaign', {
              url : '/campaign',
              controller : 'campaignCtrl',
              templateUrl: 'views/campaign/campaign.html',

            });



          });









