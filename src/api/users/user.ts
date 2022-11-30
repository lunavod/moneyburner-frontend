import { Type } from 'class-transformer'

import { TeamMembership } from '../team/team'
import { Title } from '../titles/title'

export class User {
  id: string
  email: string
  username: string
  avatarUrl?: string
  roles?: Role[]
  favorites?: Title[]

  googleConnected: boolean
  yandexConnected: boolean
  vkConnected: boolean

  teamMemberships?: TeamMembership[]

  @Type(() => Date)
  createdAt: Date
}

export interface RegisterUser {
  username: string
  email: string
  password: string
}

export class Role {
  id: string

  name: string

  permissions: Permission[]
}

export const Permission = {
  MANAGE_PARSERS: 'MANAGE_PARSERS',
  MANAGE_TITLES: 'MANAGE_TITLES',
  MANAGE_ROLES: 'MANAGE_ROLES',
  MANAGE_USERS: 'MANAGE_USERS',
  MANAGE_TEAMS: 'MANAGE_TEAMS',
}
export type Permission =
  | 'MANAGE_PARSERS'
  | 'MANAGE_TITLES'
  | 'MANAGE_ROLES'
  | 'MANAGE_USERS'
  | 'MANAGE_TEAMS'

export const PermissionNames = {
  MANAGE_PARSERS: 'Парсеры',
  MANAGE_TITLES: 'Тайтлы',
  MANAGE_ROLES: 'Роли',
  MANAGE_USERS: 'Пользователи',
  MANAGE_TEAMS: 'Команды',
}
