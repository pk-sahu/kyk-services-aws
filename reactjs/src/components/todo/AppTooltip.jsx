import React, { forwardRef } from 'react'
import Tippy from '@tippy.js/react'
import 'tippy.js/dist/tippy.css'

const ColoredTooltip = () => {
  return <span style={{ color: 'yellow' }}>Colored</span>
}

const CustomChild = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <div>First line</div>
      <div>Second line</div>
    </div>
  )
})

function AppTooltip () {
  return (
    <div className='App'>
        *******Tooltip****
      <div style={{ paddingBottom: '20px' }}>
        <Tippy content='Hello' arrow={false} delay={1000}>
          <button>My button</button>
        </Tippy>
        <Tippy content={<span style={{ color: 'orange' }}>Colored</span>}>
          <button>My button</button>
        </Tippy>
        <Tippy content={<ColoredTooltip />} >
          <button>My button</button>
        </Tippy>
        <Tippy content={adsd} placement='top-end'>
          <CustomChild />
        </Tippy>
      </div>
    </div>
  )
}

export default AppTooltip