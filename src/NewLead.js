function  getXrmPage() {
    for (var index = 0; index < frames.length; index++) {
        try {
            var controls = frames[index].Xrm.Page.ui.controls;
            if (typeof controls === 'object')
                return frames[index].Xrm.Page;
        } catch (error){
            console.debug(error);
        }
    }
}
var xp = getXrmPage();
window.global_changedFields = JSON.parse('{"subject":"Test topic","firstname":"Bob","lastname":"Smith","jobtitle":"Buyer","telephone1":"0131","emailaddress1":"reece@glinks.co.uk","companyname":"Habadasher"}');
console.log(JSON.stringify(window.global_changedFields));

for(var prop in window.global_changedFields){
    if (window.global_changedFields.hasOwnProperty(prop)) {
        var att = xp.getAttribute(prop);
        if (att){
            if (att.getAttributeType() === 'datetime' && window.global_changedFields[prop] !== null)
                att.setValue(new Date(window.global_changedFields[prop]));
            else
                att.setValue(window.global_changedFields[prop]);
            att.fireOnChange();
        }
    }
}

