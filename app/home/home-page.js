/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
const Toast = require("nativescript-toast");
const Kinvey = require('kinvey-nativescript-sdk').Kinvey;
Kinvey.init({
    appKey: 'X',
    appSecret: 'X'
});

exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
};

const user = { name: "todor", password: "pass" };
const activeUser = Kinvey.User.getActiveUser();
const userPromise = activeUser ? activeUser.me() : Kinvey.User.login(user.name, user.password); // DANGER! NOT PRODUCTION CODE!
let isLogged = false;

function showToast(msg, param) {
    console.log(msg);
    Toast.makeText(msg, param).show();
}

userPromise
    .catch(userError => {
        if (userError.name === 'InvalidCredentialsError') {
            // clear the activeUser using logout and then initiate login and return login response
            return Kinvey.User.logout()
                .then((logoutResult) => Kinvey.User.login(user.name, user.password));
        }
        // if the error is different from InvalidCredentialsError, forward it down the chain
        return Promise.reject(userError);
    })
    .then(user => {
        isLogged = true;
        showToast("User is logged in");
    })
    .catch(e => showToast(e.message, "long"));

exports.onScanResult = (scanResult) => {
    if (isLogged) {
        showToast(`${scanResult.text} (${scanResult.format})`);
    
        Kinvey.DataStore.collection("barCodesScans")
            .save({ code: scanResult.text, format: scanResult.format })
                .then(data => showToast("Barcode was saved"))
                .catch(err => showToast(err.message));
    } else {
        showToast("User log in is in progress, please wait");
    }
}
