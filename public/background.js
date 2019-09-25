chrome.runtime.onInstalled.addListener(function(){
    // alert('Installed');
})

let state=null;

chrome.runtime.onConnect.addListener(function(port){
    if (port.name=='game')
    {
        port.onMessage.addListener(function(msg){
            if(msg.caller=='mount'){
                // alert('received handshake');
                if (state!=null)
                    port.postMessage({state:state});
                // alert('sent state to mount');
            } else if (msg.caller=='update'){
                state=msg.state;
            }
        });
        port.onDisconnect.addListener(function(){
            // alert('port disconnected :(');
        });
    }
});
