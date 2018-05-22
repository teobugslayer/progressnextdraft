/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
const Toast = require("nativescript-toast");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onScanResult = (scanResult) => {
    const msg = `onScanResult6: ${scanResult.text} (${scanResult.format})`;
    console.log(msg);
    const toast = Toast.makeText(msg, "long").show();
}
