# React Fine Uploader

[![Build Status](https://travis-ci.org/FineUploader/react-fine-uploader.svg?branch=master)](https://travis-ci.org/FineUploader/react-fine-uploader)
[![Freenode](https://img.shields.io/badge/chat-on%20freenode-brightgreen.svg)](irc://chat.freenode.net/#fineuploader)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/react-fine-uploader.svg)](https://saucelabs.com/u/react-fine-uploader)


Makes using Fine Uploader in a React app simple. Drop-in high-level components for a turn-key UI. Use small focused components to build a more custom UI.

This is currently an unstable in-progress project. Breaking changes may occur at any time without notice until the version has reached 1.0. See the [wiki for details regarding the design plans](../../wiki).


## Docs

For a better understanding of the architecture and goals of the project, please read the [wiki](../../wiki). The docs section here will simply detail the various APIs exposed.

### Wrapper Classes

#### Traditional

##### `constructor({ options })`

When creating a new instance of the traditional endpoint wrapper class, pass in an object that mirrors the format of the [Fine Uploader Core options object](http://docs.fineuploader.com/branch/master/api/options.html). You may also include a `callbacks` property to include any inital [core callback handlers](http://docs.fineuploader.com/branch/master/api/events.html) that you might need. This options property is entirely optional though :laughing:.  

```javascript
import FineUploaderTraditional from 'react-fine-uploader'

const uploader = new FineUploaderTraditional({
   options: {
      autoUpload: false,
      request: {
         endpoint: 'my/upload/endpoint'
      },
      callbacks: {
         onComplete: (id, name, response) => {
            // handle completed upload
         }
      }
   }
})
```

##### `on(eventName, handlerFunction)`

Register a new callback/event handler. The `eventName` can be formatted with _or_ without the 'on' prefix. If you do use the 'on', prefix, be sure to follow lower-camel-case exactly ('onSubmit', not 'onsubmit'). If a handler has already been registered for this event, yours will be added to the "pipeline" for this event. If a previously registered handler for this event fails for some reason or returns `false`, you handler will _not_ be called. Your handler function may return a `Promise` iff it is [listed as an event type that supports promissory/thenable return values](http://docs.fineuploader.com/branch/master/features/async-tasks-and-promises.html#promissory-callbacks). 

```javascript
uploader.on('complete', (id, name, response) => {
   // handle completed upload
})
```

##### `off(eventName, handlerFunction)`

Unregister a previously registered callback/event handler. Same rules for `eventName` as  the `on` method apply here. The `handlerFunction` _must_ be the _exact_ `handlerFunction` passed to the `on` method when you initially registered said function.

```javascript
const completeHandler = (id, name, response) => {
   // handle completed upload
})

uploader.on('complete', completeHandler)

// ...later
uploader.off('complete', completeHandler)
```

##### `options`

The `options` property you used when constructing a new instance, sans any `callbacks`.

##### `methods`

Use this property to access any [core API methods exposed by Fine Uploader](http://docs.fineuploader.com/branch/master/api/methods.html).

```javascript
uploader.methods.addFiles(myFiles)
uploader.methods.deleteFile(3)
```


### Components

#### `<FileInput />`

The `<FileInput />` component allows you to easily render and style `<input type="file">` element and connect it to a Fine Uploader instance. When any files are selected via the file chooser dialog, they will be submitted directly to the associated Fine Uploder instance.

For example, suppose you wanted to create a file input button with an upload icon and some text that allows the user to select multiple files, but excludes everything but images in the chooser dialog ([where supported](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Browser_compatibility)). When files are selected by the user, they should be submitted directly to a Fine Uploader traditional endpoint handler:

Note: This assumes you have [the Ionicons CSS file](http://ionicons.com/#cdn) loaded on your page, _and_ that you have an element on your page with an ID of "content".

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import FileInput 'react-fine-uploader/components/file-input'
import FineUploaderTraditional from 'react-fine-uploader'

const uploader = new FineUploaderTraditional({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

const fileInput = (
   <FileInput multiple accept='image/*' uploader={ uploader }>
      <button class="icon ion-upload">Choose Files</button>
   </FileInput>
)

ReactDOM.render(
    fileInput,
    document.getElementById('content')
)
```

You may pass _any_ [standard `<input type="file">` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) to the `<FileInput />` component.
