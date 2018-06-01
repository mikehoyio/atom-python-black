## Python Black for Atom editor

Uses [Black](https://github.com/ambv/black) for formatting Python code.


### Requirements

Make sure you have `black` installed and the correct path to binary was set in the package config.

`pip install black`

### Keymap

``"ctrl-alt-c": "python-black:toggle"``

### Configuration
```
python-black:
  binPath: "black"
  fmtOnSave: true
```
### Thanks

Inspired by [terraform-fmt](https://github.com/mattatcha/atom-terraform-fmt) and [python-isort](https://github.com/bh/atom-python-isort)
