import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import type LinkActionsView from '@ckeditor/ckeditor5-link/src/ui/linkactionsview'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import {useEffect, useState} from 'react'

const EXTERNAL_LINK_CLASS = 'ckeditor__external-link'

type RichTextEditorProps = {
  isEditingEnabled: boolean
  onExternalLinkClick?: (event: MouseEvent, href: string) => void
}

export function RichTextEditor({
  isEditingEnabled,
  onExternalLinkClick,
}: RichTextEditorProps) {
  const [editorElement, setEditorElement] = useState<HTMLElement>()

  useEffect(() => {
    if (!editorElement || !onExternalLinkClick) return

    const externalLinks = [
      ...editorElement.querySelectorAll<HTMLAnchorElement>(
        `a.${EXTERNAL_LINK_CLASS}`,
      ),
    ]

    const listeners: {
      link: HTMLAnchorElement
      handleClick: (event: MouseEvent) => void
    }[] = []

    externalLinks.forEach(link => {
      const handleClick = (event: MouseEvent) => {
        if (!isEditingEnabled) {
          onExternalLinkClick(event, link.getAttribute('href')!)
        }
      }
      link.addEventListener('click', handleClick)
      listeners.push({link, handleClick})
    })

    return () => {
      listeners.forEach(({link, handleClick}) => {
        link.removeEventListener('click', handleClick)
      })
    }
  }, [editorElement, onExternalLinkClick, isEditingEnabled])

  return (
    <CKEditor
      editor={ClassicEditor}
      disabled={!isEditingEnabled}
      data={`<p>Hello from CKEditor 5!</p><h2>Try the inspector below</h2><ul><li>Check the Model</li><li>See the View</li><li>Check available commands</li></ul><a href="http://danger.com">UNSAFE_LINK</a>`}
      config={{
        link: {
          decorators: {
            addUnsafeLinkClass: {
              callback: url => Boolean(url?.startsWith('http://')),
              mode: 'automatic',
              classes: [EXTERNAL_LINK_CLASS],
            },
          },
        },
      }}
      onReady={editor => {
        setEditorElement(editor.editing.view.getDomRoot('main'))

        if (onExternalLinkClick) {
          const linkUI = editor.plugins.get('LinkUI')
          const contextualBalloonPlugin =
            editor.plugins.get('ContextualBalloon')

          editor.listenTo(
            contextualBalloonPlugin,
            'change:visibleView',
            (event, name, visibleView) => {
              if (visibleView === linkUI.actionsView) {
                const view = visibleView as LinkActionsView
                const linkElement = view.previewButtonView.element
                const href = linkElement?.getAttribute('href')
                if (linkElement && isExternalUrl(href)) {
                  linkElement.addEventListener('click', event => {
                    onExternalLinkClick(event, href)
                  })
                }
              }
            },
          )
        }
      }}
    />
  )
}

function isExternalUrl(url?: string | null): url is string {
  return Boolean(url && url.startsWith('http://'))
}
