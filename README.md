# Rotonde for Beaker Browser

This is an all inclusive Rotonde instance client and server.

## Setup

Download [Beaker](http://beakerbrowser.com), open it and navigato to **any Rotonde profile**, click the dropdown icon in the url and "Fork this site". Press `ctrl shift del`, to reset your portal details. Done!

## Icon

To change your display icon, update the SVG file located at `media/images/icon.svg`. The icon should be a square file for it to display properly. Keep it small.

## Commands

- `say TEXT`, to add an entry.
- `add DAT:`, to subscribe to a portal.
- `remove DAT:`, to unsubscribe to a portal.
- `edit name TEXT`, to update your portal name.
- `edit desc TEXT`, to update your portal description.
- `refresh`, to refresh.
- `portal TEXT`, view portal details.

## Shortcuts

- `ctrl+r`, refresh feed.
- `tab`, auto-complete.

## Markup

- `{{image.jpg}}`, will append an image to a post.
- `{*bold*}`, will make text bold.
- `{_bold_}`, will make text underline.
- `{url|google.com}`, will make an url.
