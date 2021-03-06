import { CompletionItem, CompletionItemKind, CompletionItemProvider, MarkdownString, Position, Range, TextDocument } from 'vscode';
import { Config } from './interface';
import { CssRemProcess } from './process';

export default class implements CompletionItemProvider {
  constructor(private cog: Config, private lan: string, private process: CssRemProcess) {}

  provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
    return new Promise(resolve => {
      const lineText = document.getText(new Range(position.with(undefined, 0), position));
      const res = this.process.convert(lineText);
      if (res.length === 0) {
        return resolve([]);
      }

      return resolve(
        res.map(i => {
          const item = new CompletionItem(i.label, CompletionItemKind.Snippet);
          if (i.documentation) {
            item.documentation = new MarkdownString(i.documentation);
          }
          item.insertText = i.value + (this.cog.addMark ? ` /* ${i.type} */` : ``);
          return item;
        }),
      );
    });
  }
}
