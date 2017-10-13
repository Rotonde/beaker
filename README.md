# Rotonde for Beaker Browser

This is an all inclusive Rotonde instance client and server.
 
## Setup

- Download [Beaker](http://beakerbrowser.com).
- Click the top-right dropdown, **New Site**.
- Clone this repo, and in beaker's top-right dropdown, change the site folder to it.
- Open the dat.json file and put in your newly created site's url(accessible by pressing the icon next to the site name).
- Select the input field, and press `ctrl shift del` to clear out my own data. **Refresh**.
- You should now see a blank feed, with a blank profile.

## Hashbase

Since we're basically just testing, messing around for now. Here's how we'll accelerate the propagation. This step will create an automated peer that will mirror your site.

- Create yourself an [Hashbase](https://hashbase.io) account.
- Click **Upload archive**.
- In your Beaker Site's library, find your portal.json file url. It should look something like this. *Don't use the one I've written here, use your own*.

```dat://2f21e3c122ef0f2555d3a99497710cd875c7b0383f998a2d37c02c042d598485/portal.json``` 

- Paste this in the Hashbase URL field.
- Set the name to rotonde, click **Add**.

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
- `TEXT // THREAD_NAME`, will collect the entry with other entries with the same thread_name.

## Commands

- `dat://`, to subscribe to a portal.
- `remove://`, to unsubscribe to a portal.
- `edit:name TEXT`, to update your portal name.
- `edit:desc TEXT`, to update your portal description.
- `edit:site URL`, to update your portal website.
- `edit:ENTRY_ID TEXT`, to edit an entry.

## Shortcuts

- `ctrl+r`, refresh feed.
- `tab`, auto-complete.

## Markup

- `{*bold*}`, will make text bold.
- `{_bold_}`, will make text underline.

## TODO

- Threads!