import {useState} from 'react'
import {Dialog, useDialog} from './dialog'
import {RichTextEditor} from './rich-text-editor'

export function App() {
  const dialog = useDialog()

  const [isEditingEnabled, setIsEditingEnabled] = useState(false)
  const [unsafeLinkHref, setUnsafeLinkHref] = useState('')

  return (
    <>
      <h1>CKEditor</h1>
      <label>
        <input
          type="checkbox"
          checked={isEditingEnabled}
          onChange={() => setIsEditingEnabled(!isEditingEnabled)}
        />{' '}
        is editing enabled?
      </label>
      <hr />
      <RichTextEditor
        isEditingEnabled={isEditingEnabled}
        onExternalLinkClick={(event, href) => {
          if (isUnsafeUrl(href)) {
            event.preventDefault()

            setUnsafeLinkHref(href)
            dialog.open()
          }
        }}
      />

      <Dialog {...dialog}>
        <h2>Unsafe link!</h2>
        <hr />
        <p>You're trying to visit potentially unsafe link, are you sure?</p>
        <a href={unsafeLinkHref} target="_" rel="noopener noreferrer">
          Yes
        </a>{' '}
      </Dialog>
    </>
  )
}

function isUnsafeUrl(url: string | null) {
  return Boolean(url && url.startsWith('http://'))
}
