import KVIN from 'kvin'
import React from 'react'

// import { Chapter } from './api/chapter/chapter'
// import { Comment } from './api/comment/comment'
// import { Genre } from './api/genre/genre'
// import { Page } from './api/page/page'
// import { Publisher } from './api/publisher/publisher'
// import { Tag } from './api/tag/tag'
// import { Title } from './api/titles/title'
// import { Role, User } from './api/users/user'

// KVIN.userCtors = {
//   Title,
//   Genre,
//   Tag,
//   Chapter,
//   Comment,
//   Page,
//   Publisher,
//   Role,
//   User,
// }

export const getContextValue = () => ({
  requests: {},
  complete: {},
  exports: globalThis.SSR_EXPORTS
    ? KVIN.deserialize(JSON.stringify(globalThis.SSR_EXPORTS))
    : {},
})

const Context = React.createContext(getContextValue())
export default Context
