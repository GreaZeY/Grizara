import React from 'react'
import "./Loader.css"
import Backdrop from "@material-ui/core/Backdrop";
const Loader = () => {
    return (
        
        <div className="loader">
            <Backdrop open='true' style={{ zIndex: "10" }} />
        <svg className="svg" width="3vmax" height="3vmax" viewBox="0 0 100 100">
  <polyline class="line-cornered stroke-still" points="0,0 100,0 100,100" stroke-width="10" fill="none"></polyline>
  <polyline class="line-cornered stroke-still" points="0,0 0,100 100,100" stroke-width="10" fill="none"></polyline>
  <polyline class="line-cornered stroke-animation" points="0,0 100,0 100,100" stroke-width="10" fill="none"></polyline>
  <polyline class="line-cornered stroke-animation" points="0,0 0,100 100,100" stroke-width="10" fill="none"></polyline>
</svg>
</div>
    )
}

export default Loader
