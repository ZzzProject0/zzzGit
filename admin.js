var admin = require("firebase-admin");

var serviceAccount = require("./passport/zzz-pwa-firebase-adminsdk-jjhuj-fdf0f89d72.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
