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
};
function logChanges(){
    var fieldsChanged = {};
    return function(eCxt){
        console.log(eCxt);
        var att = eCxt.getEventSource();
        var newValue = null;
        if (att.getValue() !== null){
            switch (att.getAttributeType()) {
                case 'lookup':
                    var oldValue = att.getValue()[0];
                    newValue = [];
                    newValue.push(
                        {
                            id: oldValue.id, 
                            entityType: oldValue.entityType,
                            name: oldValue.name
                        }
                    );
                    break;
                default:
                    newValue = att.getValue();
                    break;
            }
        }
        fieldsChanged[eCxt.getEventSource().getName()] = newValue;
        window.global_changedFields = fieldsChanged;
        console.log(fieldsChanged);
    };
};
    
var xp = getXrmPage();


if (typeof window.global_changedFieldValues !== 'undefined'){
    console.log('window.global_changedFieldValues is already registered.');
    if (confirm('window.global_changedFieldValues is already registered. Remove?')){
        xp.data.entity.attributes.forEach(function(a, i){
            console.log(a.getName() + ": " + a.getAttributeType() + ": Value: " + a.getValue() + ": dirty: " + a.getIsDirty());
            a.removeOnChange(window.global_changedFieldValues);
        });
        //window.global_changedFieldValues = new CrmDev.logChanges;    
    }
}else{
    window.global_changedFieldValues = new logChanges;
    xp.data.entity.attributes.forEach(function(a, i){
        console.log(a.getName() + ": " + a.getAttributeType() + ": Value: " + a.getValue() + ": dirty: " + a.getIsDirty());
        a.addOnChange(window.global_changedFieldValues);
    });
}

