"use babel";

import { CompositeDisposable, BufferedProcess } from "atom";

export default {
  config: {
    fmtOnSave: {
      type: "boolean",
      default: true,
      title: "Format on save"
    },
    lineLength: {
      type: "integer",
      default: 88, // default is set to 88 in black.
      minimum: 1,
      title: "Maximum line length"
    },
    binPath: {
      type: "string",
      default: "black",
      title: "Path to the black executable"
    },
    skipStringNormalization: {
      type: "boolean",
      default: false,
      title: "Skip string normalization"
    }
  },
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.workspace.observeTextEditors(textEditor => {
        if (textEditor.getGrammar().scopeName == "source.python") {
          this.subscriptions.add(
            textEditor.onDidSave(event => {
              if (atom.config.get("python-black.fmtOnSave")) {
                this.format(event.path);
              }
            })
          );
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add(
        'atom-text-editor[data-grammar="source python"]',
        "python-black:format",
        () => {
          let textEditor = atom.workspace.getActiveTextEditor();
          if (textEditor.getGrammar().scopeName != "source.python") return;
          textEditor.save();
          if (!atom.config.get("python-black.fmtOnSave")) {
            this.format(textEditor.getPath());
          }
        }
      )
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  format(file) {
    const args = ["-l", atom.config.get("python-black.lineLength")];
    if (atom.config.get("python-black.skipStringNormalization")) {
      args.push("-S");
    }
    args.push(file);
    new BufferedProcess({
      command: atom.config.get("python-black.binPath"),
      args: args
    });
  }
};
