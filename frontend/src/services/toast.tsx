import { createContext, FC, useContext, useState } from 'react'
import Toast from '../ui/toast'

interface ToastContextProps {
  showToast: (message: string, status?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: FC<any> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'success' | 'error'>('success')

  const showToast = (msg: string, stat: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setStatus(stat)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <Toast
          message={message}
          onClose={() => setMessage(null)}
          status={status}
        />
      )}
    </ToastContext.Provider>
  )
}
