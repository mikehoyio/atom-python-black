'use babel';

import { CompositeDisposable, BufferedProcess } from 'atom';

export default {
  config: {
      fmtOnSave: {
          type: 'boolean',
          default: true,
          title: 'Format on save'
      },
      binPath: {
          type: 'string',
          default: 'black',
          title: 'Path to the black executable'
      }
  },
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors((textEditor) => {
        this.subscriptions.add(textEditor.onDidSave((event) => {
            if (textEditor.getGrammar().scopeName != 'source.python') return;
            if (!atom.config.get('python-black.fmtOnSave')) return;
            this.format(event.path);
        }));
    }));

    this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source python"]', 'python-black:format', () => {
      let textEditor = atom.workspace.getActiveTextEditor();
      if (textEditor.getGrammar().scopeName != 'source.python') return;
      textEditor.save();
      if (!atom.config.get('python-black.fmtOnSave')) {
        this.format(textEditor.getPath());
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  format(file) {
    new BufferedProcess({command: atom.config.get('python-black.binPath'), args: [file]});
  }

};
