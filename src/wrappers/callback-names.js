import objectAssign from 'object-assign'

export const thenable = [
    'onCancel',
    'onPasteReceived',
    'onSubmit',
    'onSubmitDelete',
    'onValidate',
    'onValidateBatch'
]

export const traditional = [
    'onAutoRetry',
    'onCancel',
    'onComplete',
    'onAllComplete',
    'onDelete',
    'onDeleteComplete',
    'onError',
    'onManualRetry',
    'onPasteReceived',
    'onProgress',
    'onResume',
    'onSessionRequestComplete',
    'onStatusChange',
    'onSubmit',
    'onSubmitDelete',
    'onSubmitted',
    'onTotalProgress',
    'onUpload',
    'onUploadChunk',
    'onUploadChunkSuccess',
    'onValidate',
    'onValidateBatch'
]

export const s3 = objectAssign([], traditional, [
    'onCredentialsExpired'
])
