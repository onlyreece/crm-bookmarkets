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
var outWin = openNewWindow();
writeWindow(outWin, xp.data.entity.getId().replace("{","").replace("}",""));