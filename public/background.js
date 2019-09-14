chrome.runtime.onInstalled.addListener(function(){
    alert('Installed');
})

let state={
    history: [
        {
          squares: Array(9).fill(null)
        }
      ],
    stepNumber: 0,
    xIsNext: false,
    descending: false,
    stepClicked: null
};

chrome.runtime.onConnect.addListener(function(port){
    alert('connect listener');
    port.onMessage.addListener(function(msg){
        alert('message listener');
        if(msg.caller=='did-mount'){
            alert('received handshake');
            port.postMessage({state:state});
            alert('sent state to mount');
        } else if (msg.caller=='did-update'){
            state=msg.state;
            alert('state saved');
        }
    });
    port.onDisconnect.addListener(function(){
        alert('port disconnected :(');
    });
});
