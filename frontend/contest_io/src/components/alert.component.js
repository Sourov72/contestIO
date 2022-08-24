import React from 'react'

export const Alert = (props) => {
  return (
    <div
    className={props.alertclass}
    // style={linkStyle.alert}
    role="alert"
  >
    <strong>{props.alerttext}</strong>
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      // onClick={props.alerthandle}
    ></button>
  </div>
  )
}
