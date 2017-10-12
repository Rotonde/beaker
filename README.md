# Rotonde for Beaker Browser

This is an all inclusive Rotonde instance client and server.
 


## Setup

Download [Beaker](http://beakerbrowser.com), open it and navigato to **any Rotonde profile**, click the dropdown icon in the url and "Fork this site". Press `ctrl shift del`, to reset your portal details. Done!

To ensure that your feed stays up even if your computer is up you can create an account on hashbase, see the instructions on how to do that here (under the hashbase part, obv) https://github.com/Rotonde/client-electron#currently-osx--linux If you create your rotonde site through forking another's, don't forget to clear out the portal.json file(or press `ctrl shift backspace`)!

## Icon

To change your display icon, update the SVG file located at `media/images/icon.svg`. The icon should be a square file for it to display properly. Keep it small. If you update your svg manually, don't forget to go to Library->(Your Rotonde Site) and press Review Changes -> Publish, otherwise your changes wont be seen by anyone!

## Rich content

- `TEXT >> MEDIA_NAME`, will connect a media filename from `/media/content/MEDIA_NAME.jpg`.
- `TEXT // THREAD_NAME`, will collect the entry with other entries with the same thread_name.

## Commands

- `dat://`, to subscribe to a portal.
- `remove://`, to unsubscribe to a portal.
- `edit:name TEXT`, to update your portal name.
- `edit:desc TEXT`, to update your portal description.
- `edit:ENTRY_ID TEXT`, to edit an entry.

## Shortcuts

- `ctrl+r`, refresh feed.
- `tab`, auto-complete.

## Markup

- `{*bold*}`, will make text bold.
- `{_bold_}`, will make text underline.

## TODO

- Threads!