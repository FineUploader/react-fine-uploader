<img class="nav-logo" src="https://facebook.github.io/react/img/logo.svg" width="32" height="32">
<a href="http://fineuploader.com/designers">
   <img src="http://fineuploader.smartimage.com/pimg/a8680d51" width="300">
</a>

[![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)
[![Build Status](https://travis-ci.org/FineUploader/react-fine-uploader.svg?branch=master)](https://travis-ci.org/FineUploader/react-fine-uploader)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/react-fine-uploader2.svg)](https://saucelabs.com/u/react-fine-uploader2)


Makes using [Fine Uploader](http://fineuploader.com) in a React app simple. Drop-in high-level components for a turn-key UI. Use small focused components to build a more custom UI.

**This is currently an unstable in-progress project. Breaking changes may occur at any time without notice until the version has reached 1.0. See the [wiki for details regarding the design plans](../../wiki).**


## Docs

For a better understanding of the architecture and goals of the project, please read the [wiki](../../wiki). The docs section here will simply detail the various APIs exposed.

### Quick Reference

- [Installing](#installing)
- [Wrapper Classes](#wrapper-classes)
   - [Traditional](#traditional) - upload files to a server you created and control.
- [Components](#components)
   - [`<CancelButton />`](#cancelbutton-)
   - [`<DeleteButton />`](#deletebutton-)
   - [`<Dropzone />`](#dropzone-)
   - [`<FileInput />`](#fileinput-)
   - [`<Filename />`](#filename-)
   - [`<Filesize />`](#filesize-)
   - [`<PauseResumeButton />`](#pauseresumebutton-)
   - [`<ProgressBar />`](#progressbar-)
   - [`<RetryButton />`](#retrybutton-)
   - [`<Thumbnail />`](#thumbnail-)

### Installing

0.1.0 will likely be the first version of react-fine-uploader published on npm. There are a number of components to write before that milestone can be closed out. Until then, you'll need to `git clone` the project to play around with any in-progress components. Instructions will be updated once something has been published to npm. Until then, take a look at the [unit tests](src/test/unit) and the [manual tests](src/test/manual) for examples. Two dependencies that you will need to install yourself: an A+/Promise spec compliant polyfill (for IE11) and React (which is a peer dependency).

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

#### `<CancelButton />`

The `<CancelButton />` component allows you to easily render a useable cancel button for a submitted file. An file can be "canceled" at any time, except after it has uploaded successfully, and before it has passed validation (and of course after it has already been canceled).

By default, the `<CancelButton />` will be rendered and clickable only when the associated file is eligible for cancelation. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been canceled or has uploaded successfully, the button will essentially disappear. You can change this behavior by setting appropriate options.

##### Properties

- `children` - (child elements/components of `<CancelButton>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Cancel".

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfCancelable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not cancelable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a cancel button for each submitted file along with a [`<Thumbnail />`](#thumbnail-), and will ensure the elements representing a file are removed if the file is canceled.

```javascript
import React, { Component } from 'react'

import CancelButton 'react-fine-uploader/components/cancel-button'
import FineUploaderTraditional from 'react-fine-uploader'
import Thumbnail 'react-fine-uploader/components/thumbnail'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const submittedFiles = this.state.submittedFiles

                submittedFiles.push(id)
                this.setState({ submittedFiles })
            }
            else if (isFileGone(newStatus)) {
                const submittedFiles = this.state.submittedFiles
                const indexToRemove = submittedFiles.indexOf(id)

                submittedFiles.splice(indexToRemove, 1)
                this.setState({ submittedFiles })
            }
        })
    }

    render() {
        return (
            <div>
                {
                   this.state.submittedFiles.map(id => {
                        <div key={ id }>
                           <Thumbnail id={ id } uploader={ uploader } />
                           <CancelButton id={ id } uploader={ uploader } />
                        </div>
                    ))
                }
            </div>
        )
    }
}

const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<CancelButton />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<DeleteButton />`

The `<DeleteButton />` component allows you to easily render a useable delete button for an uploaded file. An file can be deleted from the server if the option has been enabled and if the file has already uploaded successfully.

By default, the `<DeleteButton />` will be rendered and clickable only when the associated file is eligible for deletion. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been deleted, or while it is still uploading, the button will not be visible. You can change this behavior by setting appropriate options.

##### Properties

- `children` - (child elements/components of `<DeleteButton>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Delete".

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfDeletable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not deletable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a delete button for each submitted file along with a [`<Thumbnail />`](#thumbnail-), and will ensure the elements representing a file are removed if the file is deleted.

```javascript
import React, { Component } from 'react'

import DeleteButton 'react-fine-uploader/components/delete-button'
import FineUploaderTraditional from 'react-fine-uploader'
import Thumbnail 'react-fine-uploader/components/thumbnail'

const uploader = new FineUploader({
   options: {
      deleteFile: {
         enabled: true,
         endpoint: 'my/delete/endpoint'
      },
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const submittedFiles = this.state.submittedFiles

                submittedFiles.push(id)
                this.setState({ submittedFiles })
            }
            else if (isFileGone(newStatus)) {
                const submittedFiles = this.state.submittedFiles
                const indexToRemove = submittedFiles.indexOf(id)

                submittedFiles.splice(indexToRemove, 1)
                this.setState({ submittedFiles })
            }
        })
    }

    render() {
        return (
            <div>
                {
                   this.state.submittedFiles.map(id => {
                        <div key={ id }>
                           <Thumbnail id={ id } uploader={ uploader } />
                           <DeleteButton id={ id } uploader={ uploader } />
                        </div>
                    ))
                }
            </div>
        )
    }
}

const isFileGone = status => {
    return [
        'canceled',
        'deleted',
    ].indexOf(status) >= 0
}
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<DeleteButton />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<Dropzone />`

This component provides an element that will accept dropped files or directories to be passed on to an underlying Fine Uploader instance. By default, the rendered component itself will accept these files, but you can also register another element in the DOM (such as `document.body`) to receive dropped files instead. 

##### Properties

- `dropActiveClassName` - Directly maps to the [`classes.dropActive property` on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#classes.dropActive). 

- `element` - The DOM element to register as a drop zone. If omitted, the rendered `<Dropzone />` element will become the drop zone.

- `multiple` - Directly maps to the [`allowMultipleItems` property on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#allowMultipleItems).

- `onDropError` - Directly maps to the [`callbacks.dropError` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#dropError). React Fine Uploader will log any errors when the underlying DnD instance invokes the `dropError` callback, but you can specify additional behavior as well.

- `onProcesssingDroppedFiles` - Directly maps to the [`callbacks.processingDroppedFiles` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFiles). 

- `onProcessingDroppedFilesComplete` - Directly maps to the [`callbacks.processingDroppedFilesComplete` option on Fine Uploader's standalone drag-and-drop module](http://docs.fineuploader.com/branch/master/features/drag-and-drop.html#processingDroppedFilesComplete). React Fine Uploader will send all files to the underlying Fine Uploader instance when this callback is invoked, but you may specify additional logic as well.

- `uploader` - The only required option - a Fine Uploader [wrapper class](#wrapper-classes).

A _very_ simple but completely functional and effective use of the `<Dropzone />` component can be seen below. This will render an element on the page that accepts files (all supported browsers) or even directories (Chrome & Opera only) and then submits them to Fine Uploader:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import FileInput 'react-fine-uploader/components/dropzone'
import FineUploaderTraditional from 'react-fine-uploader'

const uploader = new FineUploaderTraditional({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

const dropzone = (
    <Dropzone style={ { border: '1px dotted', height: 200, width: 200 } }
              uploader={ uploader }
    >
        <span>Drop Files Here</span>
    </Dropzone>
)

ReactDOM.render(
    dropzone,
    document.getElementById('content')
)
```

#### `<FileInput />`

The `<FileInput />` component allows you to easily render and style an `<input type="file">` element and connect it to a Fine Uploader instance. When any files are selected via the file chooser dialog, they will be submitted directly to the associated Fine Uploder instance.

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

#### `<Filename />`

The `<Filename />` component renders the initial name of the associated file _and_ updates when the file's name is changed through the API.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a filename for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```javascript
import React, { Component } from 'react'

import FineUploaderTraditional from 'react-fine-uploader'
import Filename 'react-fine-uploader/components/filename'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('submitted', id => {
            const submittedFiles = this.state.submittedFiles

            submittedFiles.push(id)
            this.setState({ submittedFiles })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.submittedFiles.map(id => (
                        <Filename id={ id } uploader={ uploader } />
                    ))
                }
            </div>
        )
    }
}
```

#### `<Filesize />`

The `<Filesize />` component renders the size of a specific file, formatted based on the a set of customizable rules.
It also accounts for scaled images, which do not have a file size available until upload time.

The internal logic of this component uses the IEEE definition when determining whether to display the
size as kilobytes, megabytes, gigabytes, or terabytes. For example, 1100 bytes is represented, by default,
as "1.10 KB".

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `units` - An object containing printable text for each size unit. The size unit keys include
`byte`, `kilobyte`, `megabyte`, `gigabyte`, and `terabyte`. The default text values for these units are
`B`, `KB`, `MB`, `GB`, and `TB` (respectively).

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

Suppose you wanted to render a file size for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```javascript
import React, { Component } from 'react'

import FineUploaderTraditional from 'react-fine-uploader'
import Filesize 'react-fine-uploader/components/filesize'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('submitted', id => {
            const submittedFiles = this.state.submittedFiles

            submittedFiles.push(id)
            this.setState({ submittedFiles })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.submittedFiles.map(id => (
                        <Filesize id={ id } uploader={ uploader } />
                    ))
                }
            </div>
        )
    }
}
```

If you wanted to display units as "bytes", "kilobytes", etc (instead of the default text), your `FileSize`
component would look like this instead:

```javascript
const customUnits = {
    byte: 'bytes',
    kilobyte: 'kilobytes',
    megabyte: 'megabytes',
    gigabyte: 'gigabytes',
    terabyte: 'terabytes'
}

<Filesize id={ id } units={ customUnits } uploader={ uploader } />
```

#### `<PauseResumeButton />`

The `<PauseResumeButton />` component allows you to easily render a useable pause/resume button for a submitted file. An file can be "paused" manually when the upload is in progress after at least one chunk has uploaded successfully. A paused upload can then be resumed by pressing the same button.

When a file can be paused, the word "Pause" will appear in the button if no `pauseChildren` property has been specified. When it can be resumed, the button will be changed to "Resume" if no `resumeChildren` property has been defined. The former case will pause the upload on click, and the latter will resume. If the file cannot be paused or resumed, by default, the button will not be rendered.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfEnabled` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is both not pausable and not resumable.

- `pauseChildren` - (child elements/components of `<RetryButton>`. Use this for any text of graphics that you would like to display inside the rendered pause button. If the component is childless, the button will be rendered with a simple text node of "Pause".

- `resumeChildren` - (child elements/components of `<RetryButton>`. Use this for any text of graphics that you would like to display inside the rendered resume button. If the component is childless, the button will be rendered with a simple text node of "Resume".

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a pause/resume button for each submitted file along with a [`<Thumbnail />`](#thumbnail-).

```javascript
import React, { Component } from 'react'

import FineUploaderTraditional from 'react-fine-uploader'
import PauseResumeButton 'react-fine-uploader/components/PauseResume-button'
import Thumbnail 'react-fine-uploader/components/thumbnail'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const submittedFiles = this.state.submittedFiles

                submittedFiles.push(id)
                this.setState({ submittedFiles })
            }
        })
    }

    render() {
        return (
            <div>
                {
                   this.state.submittedFiles.map(id => {
                        <div key={ id }>
                           <Thumbnail id={ id } uploader={ uploader } />
                           <PauseResumeButton id={ id } uploader={ uploader } />
                        </div>
                    ))
                }
            </div>
        )
    }
}
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<PauseResumeButton />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<ProgressBar />`

The ProgressBar component allows for a per-file _or_ a total progress bar to be rendered and automatically updated
by the underlying upload wrapper instance. This covers the per-file and total progress bar elements found in Fine Uploader UI. The underlying element used to display progress is the native [HTML5 `<progress>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress), which should display a 
progress bar consistent with the look and feel of the underlying operating system. This progress bar _can_ be
styled though. 

##### Properties

- `id` - If this is a per-file progress bar, specify the ID of the file to monitor. For a total progress bar, omit this
property.

- `hideBeforeStart` - Defaults to `true`, which ensures the progress bar is not visible until the associated file has
started uploading. For total progress bars, this stays hidden until at least one file has started uploading.

- `hideOnComplete` - Defaults to `true`, which ensures the progress bar is no longer visible once the associated file
has completed uploading. For total progress bars, the bar is hidden once _all_ files have completed uploading.

- `uploader` - The only required option - a Fine Uploader [wrapper class](#wrapper-classes).

Consider embedding a per-file `<ProgressBar />`, such as `<ProgressBar id={ 3 } uploader={ uploader } />`, alongside
a [`<Thumbnail />` component](#thumbnail-) for the same file. A total progress bar - `<ProgressBar uploader={ uploader } />` - should probably be included before the container element that holds all file 
`<Thumbnail />` elements, such as at the top of a [`<Dropzone />`](#dropzone-).

#### `<RetryButton />`

The `<RetryButton />` component allows you to easily render a useable retry button for a submitted file. An file can be "retried" manually after all auto retries have been exhausted on an upload failed _and_ if the [server has not forbidden retries in the upload response](http://docs.fineuploader.com/branch/master/api/options.html#retry.preventRetryResponseProperty).

By default, the `<RetryButton />` will be rendered and clickable only when the associated file is eligible to be manually retried. Otherwise, the component will _not_ render a button. In other words, once, for example, the associated file has been canceled or has uploaded successfully, the button will essentially disappear. You can change this behavior by setting appropriate options

##### Properties

- `children` - (child elements/components of `<RetryButton>`. Use this for any text of graphics that you would like to display inside the rendered button. If the component is childless, the button will be rendered with a simple text node of "Retry".

- `id` - The Fine Uploader ID of the submitted file. (required)

- `onlyRenderIfRetryable` - Defaults to `true`. If set to `false`, the element will be rendered as a disabled button if the associated file is not retryable.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

The example below will include a retry button for each submitted file along with a [`<Thumbnail />`](#thumbnail-).

```javascript
import React, { Component } from 'react'

import FineUploaderTraditional from 'react-fine-uploader'
import RetryButton 'react-fine-uploader/components/retry-button'
import Thumbnail 'react-fine-uploader/components/thumbnail'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('statusChange', (id, oldStatus, newStatus) => {
            if (newStatus === 'submitted') {
                const submittedFiles = this.state.submittedFiles

                submittedFiles.push(id)
                this.setState({ submittedFiles })
            }
        })
    }

    render() {
        return (
            <div>
                {
                   this.state.submittedFiles.map(id => {
                        <div key={ id }>
                           <Thumbnail id={ id } uploader={ uploader } />
                           <RetryButton id={ id } uploader={ uploader } />
                        </div>
                    ))
                }
            </div>
        )
    }
}
```

You may pass _any_ standard [`<button>` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (or any standard element attributes, such as `data-` attributes) to the `<RetryButton />` as well. These attributes will be attached to the underlying `<button>` element.

#### `<Thumbnail />`

The `<Thumbnail />` component allows you to easily render Fine Uploader generated thumbnail previews for a specific submitted file. While the thumbnail generation is in progress, a SVG "waiting" graphic will render. Of the thumbnail generation succeeds, the "waiting" graphic will be removed from the DOM and replaced with a `<canvas>` element containing the thumbnail preview. If thumbnail generation fails, a "not available" SVG graphic will be rendered instead.

##### Properties

- `id` - The Fine Uploader ID of the submitted file. (required)

- `maxSize` - Maps directly to the [`maxSize` parameter](http://docs.fineuploader.com/branch/master/api/methods.html#drawThumbnail) of the Fine Uploader `drawThumbnail` API method. If not supplied a default value is used, which is exported as a named constant.

- `notAvailablePlaceholder` - A custom element to display if the thumbnail is not available.

- `uploader` - A Fine Uploader [wrapper class](#wrapper-classes). (required)

- `waitingPlaceholder` - A custom element to display while waiting for the thumbnail.

Suppose you wanted to render a thumbnail for each file as new files are submitted to Fine Uploader. Your React component may look like this:

Note: This assumes you have additional components or code to allow files to actually be submitted to Fine Uploader.

```javascript
import React, { Component } from 'react'

import FineUploaderTraditional from 'react-fine-uploader'
import Thumbnail 'react-fine-uploader/components/thumbnail'

const uploader = new FineUploader({
   options: {
      request: {
         endpoint: 'my/upload/endpoint'
      }
   }
})

export default class FileListener extends Component {
    constructor() {
        super()

        this.state = {
            submittedFiles: []
        }
    }

    componentDidMount() {
        uploader.on('submitted', id => {
            const submittedFiles = this.state.submittedFiles

            submittedFiles.push(id)
            this.setState({ submittedFiles })
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.submittedFiles.map(id => (
                        <Thumbnail id={ id } uploader={ uploader } />
                    ))
                }
            </div>
        )
    }
}
```
