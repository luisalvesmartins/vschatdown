const vscode = require('vscode');
const path = require('path');

var ChatDownPanel=null;
var extPath="";
var lastLength=0;
var editor;

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ChatDown" is now active!');
	extPath=context.extensionPath;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.chatdown', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Running ChatDown');

        // if there is Uri it means the file was selected in the explorer.
		editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showWarningMessage('No active text editor found!');
			return;
		}
		var doc= vscode.window.activeTextEditor.document;

		//vscode.window.showInformationMessage(vscode.window.activeTextEditor.document.fileName);
		const columnToShowIn = vscode.window.activeTextEditor
				? vscode.window.activeTextEditor.viewColumn
				: undefined;

        // If we already have a panel, show it.
        if (ChatDownPanel) {
            ChatDownPanel.reveal(columnToShowIn);
            return;
        }

		ChatDownPanel = vscode.window.createWebviewPanel(
			'chatDown',
			'ChatDown',
			vscode.ViewColumn.Two,
			{
				enableScripts: true,
			}
		);

		ChatDownPanel.onDidDispose(
			() => {
				// When the panel is closed, cancel any future updates to the webview content
				clearInterval(interval);
				ChatDownPanel=null;
			},
			null,
			context.subscriptions
		);

		//ChatDownPanel.webview.html = getWebviewContent("");
		ChatDownPanel.webview.html = getWebviewContent();

		ChatDownPanel.webview.onDidReceiveMessage(
			message => {
				editor.edit(editBuilder => {
					editBuilder.insert(editor.selection.active, "user:" + message.text + "\r\n");
				  });
			},
			undefined,
			context.subscriptions
		);

		var updateWebview = () => {
			up(doc);
		};

		updateWebview();
		const interval = setInterval(updateWebview, 1000);
});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function up(doc){
	var text=doc.getText();
	var tlines=doc.lineCount;
	if (tlines!=lastLength)
	{
		lastLength=tlines;
		//bot: [Attachment=cards/AskForLocation.json adaptivecard]
		ChatDownPanel.webview.postMessage(text);
	}
}

function getWebviewContent(){
	const scriptUri = vscode.Uri.file(
		path.join(extPath, 'static', 'offlinebotchat.js'))
		.with({ scheme: 'vscode-resource' });
	const scriptUriCD = vscode.Uri.file(
			path.join(extPath, 'static', 'ChatDownSource.js'))
			.with({ scheme: 'vscode-resource' });
	var scriptUriCode = vscode.Uri.file(
		path.join(extPath, 'static', 'code.js'))
		.with({ scheme: 'vscode-resource' });
	const scriptUriJQuery = vscode.Uri.file(
		path.join(extPath, 'static', 'jquery-1.10.2.min.js'))
		.with({ scheme: 'vscode-resource' });
			
	return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="https://cdn.botframework.com/botframework-webchat/latest/botchat.css" rel="stylesheet" />
	<script src="${scriptUriCode}"></script>
	<script src="${scriptUri}"></script>
	<script src="${scriptUriCD}"></script>
	<script src="${scriptUriJQuery}"></script>
    <title>ChatDown</title>
</head>
<body>
<div id="botDivElement"></div>
<script>
window.onload=init;
</script>
</body>
</html>`;
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
