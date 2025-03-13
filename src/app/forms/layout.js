import React from 'react'
import { FormsProvider } from '@/context/FormsContext'
import FormsHeader from '@/components/layout/forms/FormsHeader'
import FormsFooter from '@/components/layout/forms/FormsFooter'
import './FormsLayout.css'

function FormsLayout({ children }) {
    return (
        <FormsProvider  >
            <div className='forms-layout'>
                <div className="forms-header">
                    <FormsHeader />
                </div>
                <div className='forms-content'>
                    {children}
                </div>
                <div className="forms-footer">
                    <FormsFooter />
                </div>
            </div>
        </FormsProvider>
    )
}

export default FormsLayout