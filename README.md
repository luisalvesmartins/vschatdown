# VS Code ChatDown
Visual Studio Code Extension for Bot ChatDown

## Features

Basic ChatDown syntax accepted.

Open a chatdown file or create a new text file, run "ChatDown" and a new VS window will open with the chat preview.

The chat is refreshed everytime a new line is added or deleted.

![Screenshot](images/screenshot.png)

> Tip: Check the chatdown page here: https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown


## Requirements

Visual Studio Code!

## Known Issues

Only basic syntax supported now. No fancy adaptive cards yet.

This works:
```
bot:[Herocard  
    title=HeroCard!
    subtitle=Hero Card, what else?
    text=Some text describing the card, it's cool because it's cool
    image=https://www.linkthatwillbeignored.com
    buttons=Option 1| Option 2| Option 3]
```


## Release Notes

Check the [ChangeLog](./CHANGELOG.md)