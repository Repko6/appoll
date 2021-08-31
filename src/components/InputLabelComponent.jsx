import React, { useState } from 'react'


export const InputLabelComponent = ({ value, changeEvent, editMode, changeEditMode, classNameLabel, classNameInput }) => {
    return (
        <>
            {editMode ?
                <input type="text" value={value} className={classNameInput} onChange={(event) => changeEvent(event, false)} onBlur={(event) => { changeEvent(event, true); changeEditMode(false); }} /> :
                <span onClick={() => changeEditMode(true)} className={classNameLabel}>{value}</span>}
        </>
    )
}