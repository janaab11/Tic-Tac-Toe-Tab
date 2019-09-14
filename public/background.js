chrome.runtime.onInstalled.addListener(function(){
    // alert('Installed');
})

let state={
    history: [
        {
          squares: Array(9).fill(null)
        }
      ],
    stepNumber: 0,
    xIsNext: true,
    descending: false,
    stepClicked: null
};

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(function(msg){
        if(msg.caller=='did-mount'){
            // alert('received handshake');
            port.postMessage({state:state});
            // alert('sent state to mount');
        } else if (msg.caller=='did-update'){
            state=msg.state;
        }
    });
    port.onDisconnect.addListener(function(){
        // alert('port disconnected :(');
    });
});
