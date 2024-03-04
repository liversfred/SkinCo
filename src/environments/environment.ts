// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  seedData: false,
  defaultPassword: 'Password123!',
  firebase: {
    apiKey: "AIzaSyCZwc3d2U61W-n4pGd3d2xXAdyVCMarSB0",
    authDomain: "skinco-62ad8.firebaseapp.com",
    projectId: "skinco-62ad8",
    storageBucket: "skinco-62ad8.appspot.com",
    messagingSenderId: "18510123362",
    appId: "1:18510123362:web:25d511e645293bee021c3b"
	},
  googleMapsApiKey: 'AIzaSyCrr0hZc7KMkDa96jZidK8aYxbyNS3jraU',
  defaultLat: 15.484958197991022,
  defaultLng: 120.97562615856529,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
