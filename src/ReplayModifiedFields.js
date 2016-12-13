
    if (typeof(CrmDev) === "undefined") var CrmDev = {};
    CrmDev.getXrmPage = function(){
        if (typeof Xrm === "object" && Xrm.Page.ui !== null) 
            return Xrm.Page;
        else{
            for (var index = 0; index < frames.length; index++) {
                var frame = frames[index];
                if (typeof frame.Xrm === "object" && frame.Xrm.Page.ui !== null){
                    return frame.Xrm.Page;
                }
                    
            }
        }
    };
    
    var xp = CrmDev.getXrmPage();

    if (typeof window.global_changedFields !== 'undefined'){
        console.log(JSON.stringify(window.global_changedFields));
        window.global_changedFields = JSON.parse(prompt('Current saved data is below, replace if necessary', JSON.stringify(window.global_changedFields)));
        console.log(JSON.stringify(window.global_changedFields));
    }else{
        if (confirm('Would you like to use the defaults?')){
            window.global_changedFields = JSON.parse('{"subject":"Test topic","firstname":"Bob","lastname":"Smith","jobtitle":"Buyer","telephone1":"0131","emailaddress1":"reece@glinks.co.uk","companyname":"Habadasher"}');
        }else{
            window.global_changedFields = JSON.parse(prompt('No saved data, paste from previous step'));
        }
        console.log(JSON.stringify(window.global_changedFields));
    }
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

