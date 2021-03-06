const vscode = acquireVsCodeApi();

var DirectLineEmulator={
    emptyActivity:{
        "activities": [],
        "watermark": "0"
    },
    userActivity:function(activity){
        vscode.postMessage(activity);
    },
    getActivity:function(activity){
        if (lastMessageID!=messageID){
            // console.log(this.emptyActivity);
            lastMessageID=messageID;
        }
        this.emptyActivity.watermark=messageID;
        return this.emptyActivity;
    }
}
var lastMessageID=-1;
var started=false;
function init(){
    const user = { id: 'user', name: 'User' };
    const bot = { id: 'botid', name: 'bot' };
    const styleOptions = {
        bubbleBackground: 'rgba(0, 0, 255, .1)',
        bubbleFromUserBackground: 'rgba(0, 255, 0, .1)',
        botAvatarInitials: 'Bot',
        userAvatarInitials: 'User',
        showSpokenText: true,
    };
    window.WebChat.renderWebChat({
        directLine: window.WebChat.createDirectLine({ token: '' }),
        bot: bot,
        user: user,
        styleOptions
    }, document.getElementById('botDivElement'));        
    started=true;
    send("Welcome to the BotDown VS extension");
}
var messageID=0;
function send(text){
  messageID++;
  var message={activities:[{
    "conversation": {
      "id": "something"
    },
    "id": messageID,
    "from": {
      "id": "botid","name": "bot","role": "bot"
    },
    "recipient": {
      "id": "user","name": "user","role": "user"
    },
    "text": text,
    "timestamp": "2018-10-18T15:21:07.82108Z",
    "type": "message",
    "channelId": "web"
  }]};
  DirectLineEmulator.emptyActivity=message;
}

var lastText="";
window.addEventListener('message', event => {
    if (started){
        const message = event.data; // The JSON data our extension sent
        if (message!=lastText){
            //console.log("NEW:" + message)
            renderContent(message);
            lastText=message;
            // send(message.text);
        }
    }
});



var fileList=[];
var historyAct=[];
var BD="";
function renderContent(content)
{
    BD=content;

    fileList=[];
    var original=content;
    var pos=original.indexOf("Attachment=");
    while (pos>0) {
        var pos2=original.substr(pos+11).indexOf(" ");
        var pos3=original.substr(pos+11).indexOf("]");
        if (pos3<pos2 || pos2==-1)
            pos2=pos3;
        var file=original.substr(pos+11,pos2);

        fileList.push({ file:file, content:null});
        pos=original.indexOf("Attachment=",pos+1);
    }

    if (fileList.length>0)
        loadImage(0);
    else
        renderContent2(content);
}

function loadImage(index){
    //console.log("LOAD FILE:" + fileList[index].file);
    $.get( fileList[index].file, function( data ) {
        //console.log(fileList[index].file)
        fileList[index].content=data;
        index++;
        if(index < fileList.length) {
            loadImage(index);
        }
        else
        {
            renderContent2(BD);
        }
    }).fail(function(){ 
        //console.log("ERROR LOADING");
        //console.log(fileList[index].file)
        fileList[index].content="";
        index++;
        if(index < fileList.length) {
            loadImage(index);
        }
        else
        {
            renderContent2(BD);
        }
    });
}

function renderContent2(content){
    var chatDown=readContents(content)
    //document.all("result").innerText= JSON.stringify(chatDown, undefined,2 );
    //console.log(JSON.stringify(chatDown, undefined,2 ));
    historyAct=[];
    for(let activity of chatDown){
        if (activity.type=="ActivityTypes.Message"){
            if (activity.attachments)
            {
                //console.log(activity.attachments[0]);
                try{
                if (typeof activity.attachments[0].content =="string"){
                    var card=JSON.parse(activity.attachments[0].content);
                    delete card["$schema"];
                    activity.attachments[0].content=card;
                }
                }catch(e){}
            }
            activity.type="message";
        }
        historyAct.push(activity);
    }
    //document.all("displayActivities").innerHTML=sOutput;
    messageID++;
    $(".wc-message-group-content").html("");
    DirectLineEmulator.emptyActivity={activities:historyAct};
}
