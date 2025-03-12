import React from 'react'

export const metadata = {
    title: "Confidi | Home",
    description: "Confidi home",
};

function HomeLayout({ children }) {
    return (
        <div>{children}</div>
    )
}

export default HomeLayout