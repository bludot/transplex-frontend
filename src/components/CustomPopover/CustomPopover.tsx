import { Popover } from '@headlessui/react'

import React, {useState} from "react";
import { usePopper } from 'react-popper'

function CustomPopover({children, label, maxHeight}: { children: React.ReactNode, label: string, maxHeight?: string }) {
  let [referenceElement, setReferenceElement] = useState()
  let [popperElement, setPopperElement] = useState()
  let { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  })

  return (
    <Popover>
      <Popover.Button ref={setReferenceElement}>
        {label}
      </Popover.Button>
      <Popover.Panel
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="bg-white shadow-lg rounded-lg p-4 overflow-y-auto" style={{maxHeight: maxHeight ? maxHeight : 'auto'}}>
        {children}
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default CustomPopover