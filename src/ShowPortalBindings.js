function getXrmPage() {
    for (var index = 0; index < frames.length; index++) {
        try {
            var controls = frames[index].Xrm.Page.ui.controls;
            if (typeof controls === "object")
                return frames[index].Xrm.Page;
        } catch (error) {
            console.debug(error);
        }
    }
}

function getData(query, callback)
{
    var request = new XMLHttpRequest(); 
    request.open('GET', encodeURI(query), true);
    request.setRequestHeader("OData-MaxVersion", "4.0");
    request.setRequestHeader("OData-Version", "4.0");
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    //request.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
    // if (formattedValue) {
    //     request.setRequestHeader("Prefer",
    //         "odata.include-annotations=OData.Community.Display.V1.FormattedValue");
    // }
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            request.onreadystatechange = null;
            switch (this.status) {
                case 200: // Success with content returned in response body.
                case 204: // Success with no content returned in response body.
                    callback(null, this);
                    break;
                default: // All other statuses are unexpected so are treated like errors.
                    var error;
                    try {
                        error = JSON.parse(request.response).error;
                    } catch (e) {
                        error = new Error("Unexpected Error");
                    }
                    callback(error, null);
                    break;
            }
        }
    };
    request.send();
}
function openNewWindow(){
    var d = window.open(""); 
    d.document.open(); 
    return d; 
    //d.document.close();
}
function writeWindow(win, html){
    win.document.write(html);
}

var xp = getXrmPage();
var baseUrl = (typeof(xp) === 'undefined')? location.origin : xp.context.getClientUrl();
getData(baseUrl + '/api/data/v8.0/adx_websitebindings?$select=adx_sitename',function(err, data){
    if (err){
        console.error(err);
        return;
    }
    var bindings = JSON.parse(data.response);
    var outWin = openNewWindow();
    writeWindow(outWin, '<h1>Website Bindings</h1>');
    if (bindings.value){
        writeWindow(outWin, '<ul>');
        for (var index = 0; index < bindings.value.length; index++) {
            var binding = bindings.value[index];
            var bindingUrl = 'https://' + binding.adx_sitename;
            writeWindow(outWin, '<li><a href="' + bindingUrl + '">'+ bindingUrl +'</a></li>');
        }
        writeWindow(outWin, '</ul>');
    }else{
        writeWindow(outWin, 'There are no bindings available in the CRM to view.');
    }
})
