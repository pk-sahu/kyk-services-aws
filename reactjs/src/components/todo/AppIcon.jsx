import React from 'react'
import { IconContext } from 'react-icons'
import { FaReact } from 'react-icons/fa'
import { MdAlarm } from 'react-icons/md'

function AppIcon () {
  return (
    <IconContext.Provider value={{ color: 'blue', size: '2rem' }}>
      <div className='App'>
        <FaReact />
        <MdAlarm color='purple' size='4rem' />
      </div>
    </IconContext.Provider>
  )
}

export default AppIcon