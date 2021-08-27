import React from 'react'

import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav>
      <section>
        <div className="steps">
            <Link to="/list">Lista anketa</Link>
            <Link to="/score">Rezultati</Link>
        </div>
      </section>
    </nav>
  )
}