const fs = require('fs');
const bookmarklet = require('bookmarklet');
const path = require('path');
const package = require('./package.json');

console.log(package.version);

function die(msg) {
    msg && console.error('[ERROR] bookmarklet: ' + msg);
    process.exit(1);
}

function warn(msg) {
    console.error('[WARN] bookmarklet: ' + msg);
}
function dataCallbackWithDestination(destination){
    
    return function dataCallback(e, data) {
        if (e) {
            die(e.message);
        }
        
        data = bookmarklet.parseFile(data);

        if (data.errors) {
            die(data.errors.join('\n'));
        }
        data.code = 'console.log("Version '+package.version+'");' + data.code; 
        
        var code = bookmarklet.convert(data.code, data.options);
        console.log("Copying to destination: " + destination);
        if (typeof destination !== "undefined") {
            fs.writeFileSync(destination, code);
        } else {
            console.log(code);
        }
    };
}





fs.readdir("./src",null,function(err,files){
    console.log(files);
    console.log(process.cwd());
    for (var index = 0; index < files.length; index++) {
        var fileName = files[index];
        //var filePath = path.join(process.cwd(),fileName);
        var filePath = path.join("./src/",fileName);
        var destination = path.join("./dist/",fileName.replace(".js",".min.js"));
        console.log(filePath);
        console.log(destination);
        fs.readFile(filePath, 'utf8', dataCallbackWithDestination(destination));
    }
    
});