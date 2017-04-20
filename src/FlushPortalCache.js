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

function updateRecord(query, data, callback)
{
    var request = new XMLHttpRequest(); 
    request.open('PATCH', encodeURI(query), true);
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
    request.send(JSON.stringify(data));
}
function updateWebsiteRecord(websiteEntityRecord, apiUrl, windowOut){
    var websiteRecord = apiUrl + '/adx_websites('+websiteEntityRecord.adx_websiteid+')';

    var updateData = {
        "adx_name": websiteEntityRecord.adx_name + '2'
    }
    var updateData2 = {
        "adx_name": websiteEntityRecord.adx_name
    }
    
    updateRecord(websiteRecord,updateData,function(err, data){
        if (err){
            console.error(err);
            writeWindow(windowOut, '<p>Failed to update website with the following error: </p><pre>'+err+'</pre>')
            return;
        }
        console.log("Updated once");
        writeWindow(windowOut, '<div>Updated ' + websiteEntityRecord.adx_name + ' to ' + updateData.adx_name + '</div>')
        setTimeout(function(){
            updateRecord(websiteRecord,updateData2,function(err, data){
                if (err){
                    console.error(err);
                    writeWindow(windowOut, '<p>Failed to update website with the following error: </p><pre>'+err+'</pre>')
                    return;
                }
                console.log("Updated Twice");
                writeWindow(windowOut, '<div>Updated ' + websiteEntityRecord.adx_name + ' to ' + updateData2.adx_name + '</div>')
            })
        },5000)
        
    })
};
function openNewWindow(){
    var d = window.open(""); 
    d.document.open(); 
    return d; 
    //d.document.close();
}
function writeWindow(win, html){
    win.document.write(html);
}

getData(location.origin + '/api/data/v8.0/adx_websites?$select=adx_websiteid,adx_name', function(err, data){
    var outWin = openNewWindow();
    var serverUrl = location.origin + '/api/data/v8.0';
    writeWindow(outWin, '<h1>Portal Flush Cache</h1>');
    if (err){
        console.error(err);
        writeWindow(outWin, '<p>Failed to get websites with the following error: </p><pre>'+err+'</pre>')
        return;
    }

    var websites = JSON.parse(data.response);
    if (websites.value){
        writeWindow(outWin, '<ul>');
        for (var index = 0; index < websites.value.length; index++) {
            var website = websites.value[index];
            updateWebsiteRecord(website, serverUrl, outWin);
            //var bindingUrl = 'https://' + binding.adx_sitename;
            writeWindow(outWin, '<li>Website: '+website.adx_name+'</li>');
        }
        writeWindow(outWin, '</ul>');
    }else{
        writeWindow(outWin, 'There are no websites available in the CRM to flush.');
    }
});

