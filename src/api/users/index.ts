import Api from '..'
import { plainToInstance } from 'class-transformer'
import Cookies from 'js-cookie'
import { DateTime } from 'luxon'

import { RegisterUser, User } from './user'

export class UsersApi extends Api {
  async find(offset = 0, limit = 100, email?: string, roles?: string[]) {
    const req = await this.axios.get<{ users: User[]; total: number }>(
      '/users',
      {
        params: { offset, limit, email, roles },
      },
    )
    return {
      users: plainToInstance(User, req.data.users),
      total: req.data.total,
    }
  }

  async findOne(id: string) {
    const req = await this.axios.get<User>(`/users/${id}`)
    return plainToInstance(User, req.data)
  }

  async delete(id: string) {
    await this.axios.delete(`/users/${id}`)
  }

  async register(data: RegisterUser, redirect = true) {
    const req = await this.axios
      .post<User>('/auth/register', data)
      .catch((error) => error.response.data.message)

    if (typeof req == 'string') throw new Error(req)

    this.login(data.username, data.password, redirect)
  }

  async update(
    id: string,
    data: { email?: string; username?: string; roles?: string[] },
    avatar?: File,
  ) {
    const formData = this.makeForm(data)
    if (avatar) formData.append('file', avatar)

    const req = await this.axios.patch<User>(`/users/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return plainToInstance(User, req.data)
  }

  async login(username: string, password: string, redirect = true) {
    const req = await this.axios
      .post<{ access_token: string }>('/auth/login', {
        username,
        password,
      })
      .catch((error) => error.response.data.message)

    if (typeof req == 'string') throw new Error(req)

    Cookies.set('token', req.data.access_token, {
      expires: DateTime.now().plus({ days: 30 }).toJSDate(),
    })
    if (redirect) location.href = '/'
  }

  async loginWithGoogle(token: string) {
    return this.authWith('google', 'login', { token })
  }

  async registerWithGoogle(token: string) {
    return this.authWith('google', 'register', { token })
  }

  async loginWithYandex(token: string) {
    return this.authWith('yandex', 'login', { token })
  }

  async registerWithYandex(token: string) {
    return this.authWith('yandex', 'register', { token })
  }

  async loginWithVk(code: string) {
    return this.authWith('vk', 'login', { code })
  }

  async registerWithVk(code: string) {
    return this.authWith('vk', 'register', { code })
  }

  private async authWith(
    service: string,
    action: 'login' | 'register',
    data: any,
  ) {
    const req = await this.axios
      .post<{ access_token: string }>(`/auth/${service}/${action}`, data)
      .catch((error) => error.response.data.message)

    if (typeof req == 'string') throw new Error(req)

    Cookies.set('token', req.data.access_token)
    return true
  }

  async profile() {
    const req = await this.axios.get<User>('/auth/profile')
    return req.data
  }

  async logout() {
    Cookies.remove('token')
    location.reload()
  }

  async addFavorite(titleId: string) {
    const req = await this.axios.post('/users/favorite', { titleId })
    return req.data
  }

  async removeFavorite(titleId: string) {
    const req = await this.axios.delete('/users/favorite', {
      data: { titleId },
    })
    return req.data
  }

  async resetPassword(email: string) {
    const req = await this.axios.post('/auth/password-reset', null, {
      params: { email },
    })
  }

  async restorePassword(hash: string, newPassword: string) {
    const req = await this.axios.post('/auth/password-reset/' + hash, null, {
      params: { newPassword: newPassword },
    })
  }
}

const usersApi = new UsersApi()
export default usersApi
