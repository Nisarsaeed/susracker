import React from 'react'

function Spinner({styles}) {
  return (
    <div className= {`flex justify-center items-center h-full w-full ${styles} `} >
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-800 "></div>
    </div>
  )
}

export default Spinner