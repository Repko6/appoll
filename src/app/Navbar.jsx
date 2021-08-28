import React from 'react'
import { Link } from 'react-router-dom'
import editNavbar from '../icons/editNavbar.svg'
import scoreNavbar from '../icons/scoreNavbar.png'

export const Navbar = () => {
    return (
        <section className="navbar">
            <section className="navbar-item">
                <Link to="/edit">
                    <p className="navbar-item-logo">
                        <img src={editNavbar} alt="Uređivanje" className="navbar-item-logo-img" />
                    </p>
                    Uređivanje
                </Link>
            </section>
            <section className="navbar-item">
                <Link to="/score">
                    <p className="navbar-item-logo">
                        <img src={scoreNavbar} alt="Rezultati" className="navbar-item-logo-img"  />
                    </p>
                    Rezultati
                </Link>
            </section>
        </section>
    )
}