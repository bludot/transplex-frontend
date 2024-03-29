// react functional component with children
import {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Button from "../Button";

interface ModalProps {
  title: string
  children: React.ReactNode
  isOpen: boolean
  closeFn: () => void
  options?: {
    label: string
    onClick: () => void
  }[]
}

export default function Modal({children, title, isOpen, closeFn, options}: ModalProps) {

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10" onClose={closeFn}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 w-full h-full"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title>{<title></title>}</Dialog.Title>
              <div className="flex justify-between flex-col flex-no-wrap">
              <div className="mt-2">
                {children}
              </div>
              {options && options.map((option, index) => (
                <Button key={index} label={option.label} onClick={option.onClick}/>
              ))}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}