# Rotonde for Beaker Browser

This is an all inclusive Rotonde instance client and server.

## Setup

Download [Beaker](http://beakerbrowser.com), open it and navigato to **any Rotonde profile**, click the dropdown icon in the url and "Fork this site". Press `ctrl shift del`, to reset your portal details. Done!

## Icon

To change your display icon, update the SVG file located at `media/images/icon.svg`. The icon should be a square file for it to display properly. Keep it small.

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