import React, { useState } from 'react'


export const InputLabelComponent = ({ value, changeEvent, editMode, changeEditMode }) => {
    return (
        <>
            {editMode ?
                <input type="text" value={value} onChange={(event) => changeEvent(event, false)} onBlur={(event) => { changeEvent(event, true); changeEditMode(false); }} /> :
                <span onClick={() => changeEditMode(true)}>{value}</span>}
        </>
    )
}