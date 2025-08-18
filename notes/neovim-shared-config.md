---
title: Neovim shared config with vim
keywords: neovim
---

Stick this in `init.lua` to use existing `~/.vimrc` with neovim:

```lua
-- Share vim configuration
vim.cmd('set runtimepath^=~/.vim runtimepath+=~/.vim/after')
vim.o.packpath = vim.o.runtimepath
vim.cmd('source ~/.vimrc')
```
