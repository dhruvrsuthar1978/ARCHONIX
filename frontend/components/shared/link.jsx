import { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const Link = forwardRef(function Link({ href, ...props }, ref) {
  return <RouterLink ref={ref} to={href} {...props} />
})

Link.displayName = 'Link'

export default Link
