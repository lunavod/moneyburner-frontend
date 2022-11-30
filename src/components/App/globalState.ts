import { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { runInAction, _getGlobalState } from 'mobx'
import { useContext, createContext } from 'react'

import usersApi from '../../api/users'
import { User } from '../../api/users/user'
import { MobxStore, observableStore } from '../../pages/useMobx'

@observableStore
class _globalState extends MobxStore {
  user: null | User
  isMobile = !!globalThis.IS_MOBILE
  noFooter = false
  menuShown = false
  authModalActive = false
  mobileSearchActive = false
  unauthorized: null | boolean = null

  setAuthModalActive(val: boolean) {
    this.authModalActive = val
  }

  setMobileSearchActive(val: boolean) {
    this.mobileSearchActive = val
  }

  setMenuShown(val: boolean) {
    this.menuShown = val
  }

  setNoFooter(val: boolean) {
    this.noFooter = val
  }

  setIsMobile(val: boolean) {
    this.isMobile = val
  }

  setUser(user: User) {
    this.user = user
  }

  async initialize() {
    if (!Cookies.get('token')) {
      this.unauthorized = true
      return
    }
    try {
      const user = await usersApi.profile()
      runInAction(() => (this.user = user))
    } catch (err) {
      console.error(
        'Error while loading user:',
        (err as AxiosError).code,
        (err as AxiosError).response?.data,
        (err as AxiosError).config?.headers,
      )
      this.unauthorized = true
    }

    return this.waitFor(
      () => this.unauthorized === true || !!this.user,
      2000,
      'globalState',
    )
  }

  export() {
    return {
      unauthorized: this.unauthorized,
      user: this.user,
    }
  }

  import(data: any) {
    this.user = data.user
    this.unauthorized = data.unauthorized
  }
}

export const GlobalState = _globalState

export const GlobalStateContext = createContext(new GlobalState())
export const useGlobalState = () => useContext<_globalState>(GlobalStateContext)
export const useIsMobile = () => {
  const state = useGlobalState()
  return globalThis.IS_MOBILE ?? state.isMobile
}
