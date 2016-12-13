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
if (typeof window.global_changedFields !== 'undefined'){
    prompt('Copy the string below for later use', JSON.stringify(window.global_changedFields));
    console.log(JSON.stringify(window.global_changedFields));
}else{
    alert('There was no saved data to show you.')
}
