import React from 'react'

function Header({breadcrumb}){
    return (
        <section className="header">
            <section className="header-top">
                Ankete
            </section>
            <section className="header-bottom">
                Ankete / <span className="header-bottom-breadcrumbs">{breadcrumb}</span>
            </section>
        </section>
    )
}

export default Header;