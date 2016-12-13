function getXrmUtility() {
    for (var index = 0; index < frames.length; index++) {
        try {
            var openRecordFunction = frames[index].Xrm.Utility.openEntityForm;
            if (typeof openRecordFunction === "function")
                return frames[index].Xrm.Utility;    
        } catch (error) {
            console.debug(error);
        }
    }
}
var xu = getXrmUtility();
xu.openEntityForm(prompt("What is the Entity Logicalname?"),prompt("What is the ID of the record?"),null,{openInNewWindow:true});