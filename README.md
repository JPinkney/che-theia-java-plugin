# Che-Theia - Java Extension

Che-Theia - Java Extension contains the UI parts for the che-ls-jdt extension of jdt.ls.

#### Making a call to Che-LS-JDT

java-commands.ts is already setup to create calls directly to che-ls-jdt so we can call custom protocol extensions on the browser side. Here is some example code creating a ExecuteCommandRequest directly to che-ls-jdt:

```typescript
const client = await this.javaClientContribution.languageClient;
const result = await client.sendRequest(ExecuteCommandRequest.type, {
    command: JAVA_ORGANIZE_IMPORTS.id,
    arguments: [
        uri
    ]
});
```

#### Creating a keybinding

java-commands.ts is already setup to handle the keybindings that we will need to create. One thing to keep in mind is we must have context set as JavaKeybindingContexts.javaEditorTextFocus so the keybindings will only be relevant in the java editor context.

```typescript
keybindings.registerKeybinding({
    command: JAVA_ORGANIZE_IMPORTS.id,
    context: JavaKeybindingContexts.javaEditorTextFocus,
    keybinding: 'ctrlcmd+shift+o'
});
```

## License
[Apache-2.0](https://github.com/theia-ide/theia/blob/master/LICENSE)