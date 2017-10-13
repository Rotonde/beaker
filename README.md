# Rotonde for Beaker Browser

This is an all inclusive Rotonde instance client and server.

## Setup

There is a beginner-friendly setup tutorial available at the following URL: [https://louis.center/p2p-social-networking/](https://louis.center/p2p-social-networking/)

![Rotonde Beaker gif](https://louis.center/p2p-social-networking/new-post.gif)

## Rotonde

- Give yourself a username with `edit:name Some_name`.
- Give yourself a description with `edit:desc Some description`.
- Write a first message maybe.
- Share your `dat:` url with people, and past theirs to follow them.
- Enjoy!

## Icon

To change your display icon, update the SVG file located at `media/images/icon.svg`. The icon should be a square file for it to display properly. Keep it small. If you update your svg manually, don't forget to go to Library->(Your Rotonde Site) and press Review Changes -> Publish, otherwise your changes wont be seen by anyone!

## Rich content

- `TEXT >> MEDIA_NAME`, will connect a media filename from `/media/content/MEDIA_NAME.jpg`.

## Commands

- `dat://`, to subscribe to a portal.
- `edit:name TEXT`, to update your portal name.
- `edit:desc TEXT`, to update your portal description.
- `edit:site URL`, to update your portal website.
- `edit:ENTRY_ID TEXT`, to edit an entry.

## Markup

- `{*bold*}`, will make text bold.
- `{_bold_}`, will make text underline.

## Ideal Flow

### Onboarding

- **Fork Site**, would fork the site but using a custom empty portal.json file for the user to fill. Would have an option to propagate/mirror through hashbase automatically, so the user's feed is available instantly.
