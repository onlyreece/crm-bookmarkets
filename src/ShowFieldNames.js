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

var xp = getXrmPage();
xp.ui.controls.forEach(function(c,i){
    c.setLabel(c.getName()+ "("+c.getLabel()+")");
});