import React from 'react'
import "./Loader.css"
const Loader = () => {
    return (
        <div className="loader">
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
