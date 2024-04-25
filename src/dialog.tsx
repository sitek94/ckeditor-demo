import './dialog.css'
import {MouseEvent, ReactNode, RefObject, useRef} from 'react'

export function Dialog({
  close,
  children,
  dialogRef,
  onClick,
}: {
  close: () => void
  open: () => void
  children: ReactNode
  dialogRef: RefObject<HTMLDialogElement>
  onClick: (event: MouseEvent<HTMLDialogElement>) => void
}) {
  return (
    <dialog ref={dialogRef} className="dialog" onClick={onClick}>
      <div>
        {children}
        <button autoFocus onClick={close}>
          Close
        </button>
      </div>
    </dialog>
  )
}

export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const close = () => {
    dialogRef.current?.close()
  }

  const open = () => {
    dialogRef.current?.showModal()
  }

  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      close()
    }
  }
  return {
    dialogRef,
    close,
    open,
    onClick,
  }
}
