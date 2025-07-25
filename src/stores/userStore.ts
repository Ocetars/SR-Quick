import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { User, UserProfile, UserGameAccount } from '../types/user'
import { userAuthAPI, userDataAPI, userUtils, handleApiError } from '../utils/userAPI'

// 创建适配微信小程序的存储
const taroStorage = {
  getItem: (name: string): string | null => {
    try {
      return Taro.getStorageSync(name) || null
    } catch (error) {
      console.warn('获取存储失败:', error)
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Taro.setStorageSync(name, value)
    } catch (error) {
      console.warn('设置存储失败:', error)
    }
  },
  removeItem: (name: string): void => {
    try {
      Taro.removeStorageSync(name)
    } catch (error) {
      console.warn('删除存储失败:', error)
    }
  }
}

// 状态接口定义
interface UserState {
  // 用户基本信息
  user: User | null
  gameAccounts: UserGameAccount[]
  isLoggedIn: boolean
  
  // 加载状态
  isLoading: boolean
  isInitialized: boolean
  
  // 错误状态
  error: string | null
  
  // 当前选中的游戏账号
  currentAccount: UserGameAccount | null
  
  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setInitialized: (initialized: boolean) => void
  
  // 认证相关方法
  login: () => Promise<boolean>
  logout: () => void
  checkLoginStatus: () => Promise<void>
  
  // 用户信息相关方法
  updateUserInfo: (data: { nickname?: string; avatar_url?: string }) => Promise<void>
  
  // 游戏账号相关方法
  addGameAccount: (data: {
    uid: string
    nickname?: string
    level?: number
    world_level?: number
    is_primary?: boolean
  }) => Promise<void>
  setCurrentAccount: (account: UserGameAccount | null) => void
  setPrimaryAccount: (uid: string) => Promise<void>
  refreshGameAccounts: () => Promise<void>
  
  // 工具方法
  clearError: () => void
  getPrimaryAccount: () => UserGameAccount | null
  reset: () => void
}

// 初始状态
const initialState = {
  user: null,
  gameAccounts: [],
  isLoggedIn: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  currentAccount: null
}

// 创建 Zustand store
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // 基础状态设置
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setError: (error: string | null) => set({ error, isLoading: false }),
      
      setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
      
      // 检查登录状态
      checkLoginStatus: async () => {
        const state = get()
        if (state.isInitialized) return
        
        set({ isLoading: true })
        
        try {
          // 检查本地存储的用户信息
          const storedUserInfo = userUtils.getStoredUserInfo()
          
          if (storedUserInfo) {
            try {
              // 尝试从服务器获取最新的用户信息
              const profile = await userAuthAPI.getProfile()
              const currentAccount = userUtils.getPrimaryGameAccount(profile.gameAccounts)
              
              set({
                user: profile.user,
                gameAccounts: profile.gameAccounts,
                currentAccount,
                isLoggedIn: true,
                isLoading: false,
                error: null
              })
            } catch (error) {
              // 如果服务器请求失败，使用本地存储的信息
              console.warn('获取最新用户信息失败，使用本地缓存:', error)
              set({
                user: storedUserInfo,
                gameAccounts: [],
                currentAccount: null,
                isLoggedIn: true,
                isLoading: false,
                error: null
              })
            }
          }
        } catch (error) {
          console.error('检查登录状态失败:', error)
          set({ error: handleApiError(error), isLoading: false })
        } finally {
          set({ isInitialized: true })
        }
      },
      
      // 用户登录
      login: async (): Promise<boolean> => {
        set({ isLoading: true, error: null })
        
        try {
          const loginResponse = await userAuthAPI.login()
          const profile = await userAuthAPI.getProfile()
          const currentAccount = userUtils.getPrimaryGameAccount(profile.gameAccounts)
          
          set({
            user: loginResponse.user,
            gameAccounts: profile.gameAccounts,
            currentAccount,
            isLoggedIn: true,
            isLoading: false,
            error: null
          })
          
          // 显示登录成功提示
          Taro.showToast({
            title: loginResponse.isNewUser ? '欢迎新用户！' : '登录成功',
            icon: 'success'
          })
          
          return true
        } catch (error) {
          const errorMessage = handleApiError(error)
          set({ error: errorMessage, isLoading: false })
          
          Taro.showToast({
            title: errorMessage,
            icon: 'error'
          })
          
          return false
        }
      },
      
      // 用户登出
      logout: () => {
        // 清除本地存储
        userUtils.clearUserInfo()
        
        set({
          ...initialState,
          isInitialized: true
        })
        
        Taro.showToast({
          title: '已退出登录',
          icon: 'success'
        })
      },
      
      // 更新用户信息
      updateUserInfo: async (data: { nickname?: string; avatar_url?: string }) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedUser = await userAuthAPI.updateProfile(data)
          
          set({ 
            user: updatedUser, 
            isLoading: false 
          })
          
          Taro.showToast({
            title: '更新成功',
            icon: 'success'
          })
        } catch (error) {
          const errorMessage = handleApiError(error)
          set({ error: errorMessage, isLoading: false })
          
          Taro.showToast({
            title: errorMessage,
            icon: 'error'
          })
          
          throw error
        }
      },
      
      // 添加游戏账号
      addGameAccount: async (data: {
        uid: string
        nickname?: string
        level?: number
        world_level?: number
        is_primary?: boolean
      }) => {
        set({ isLoading: true, error: null })
        
        try {
          const gameAccount = await userAuthAPI.addGameAccount(data)
          const state = get()
          const newGameAccounts = [...state.gameAccounts, gameAccount]
          
          // 如果是主账号或者是第一个账号，设为当前账号
          let newCurrentAccount = state.currentAccount
          if (gameAccount.is_primary || !state.currentAccount) {
            newCurrentAccount = gameAccount
          }
          
          set({
            gameAccounts: newGameAccounts,
            currentAccount: newCurrentAccount,
            isLoading: false
          })
          
          Taro.showToast({
            title: '游戏账号添加成功',
            icon: 'success'
          })
        } catch (error) {
          const errorMessage = handleApiError(error)
          set({ error: errorMessage, isLoading: false })
          
          Taro.showToast({
            title: errorMessage,
            icon: 'error'
          })
          
          throw error
        }
      },
      
      // 设置当前账号
      setCurrentAccount: (account: UserGameAccount | null) => {
        set({ currentAccount: account })
      },
      
      // 设置主账号
      setPrimaryAccount: async (uid: string) => {
        try {
          await userAuthAPI.setPrimaryAccount(uid)
          const state = get()
          
          // 更新本地游戏账号列表
          const updatedAccounts = state.gameAccounts.map(account => ({
            ...account,
            is_primary: account.uid === uid
          }))
          
          const newCurrentAccount = updatedAccounts.find(account => account.uid === uid) || state.currentAccount
          
          set({ 
            gameAccounts: updatedAccounts,
            currentAccount: newCurrentAccount
          })
          
          Taro.showToast({
            title: '主账号设置成功',
            icon: 'success'
          })
        } catch (error) {
          const errorMessage = handleApiError(error)
          set({ error: errorMessage })
          
          Taro.showToast({
            title: errorMessage,
            icon: 'error'
          })
          
          throw error
        }
      },
      
      // 刷新游戏账号列表
      refreshGameAccounts: async () => {
        try {
          const profile = await userAuthAPI.getProfile()
          const currentAccount = userUtils.getPrimaryGameAccount(profile.gameAccounts)
          
          set({
            gameAccounts: profile.gameAccounts,
            currentAccount
          })
        } catch (error) {
          const errorMessage = handleApiError(error)
          set({ error: errorMessage })
          throw error
        }
      },
      
      // 清除错误
      clearError: () => {
        set({ error: null })
      },
      
      // 获取主账号
      getPrimaryAccount: (): UserGameAccount | null => {
        const state = get()
        return userUtils.getPrimaryGameAccount(state.gameAccounts)
      },
      
      // 重置状态
      reset: () => {
        set(initialState)
      }
    }),
    {
      name: 'sr-quick-user-storage',
      storage: createJSONStorage(() => taroStorage),
      partialize: (state) => ({
        // 只持久化用户基本信息，其他状态在应用启动时重新获取
        user: state.user,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)

// 数据同步相关的独立 store
interface UserDataState {
  // 角色数据
  characters: any[]
  
  // 同步状态
  isSyncing: boolean
  lastSyncTime: string | null
  syncError: string | null
  
  // Actions
  setSyncing: (syncing: boolean) => void
  setSyncError: (error: string | null) => void
  setCharacters: (characters: any[]) => void
  setLastSyncTime: (time: string) => void
  
  // 同步方法
  syncCharacters: (uid: string, forceUpdate?: boolean) => Promise<void>
  getCharacters: (uid?: string) => Promise<void>
  toggleCharacterFavorite: (uid: string, characterId: string, isFavorite: boolean) => Promise<void>
  deleteCharacter: (uid: string, characterId: string) => Promise<void>
  
  clearSyncData: () => void
}

// 用户数据 store
export const useUserDataStore = create<UserDataState>((set, get) => ({
  characters: [],
  isSyncing: false,
  lastSyncTime: null,
  syncError: null,
  
  setSyncing: (syncing: boolean) => set({ isSyncing: syncing }),
  setSyncError: (error: string | null) => set({ syncError: error }),
  setCharacters: (characters: any[]) => set({ characters }),
  setLastSyncTime: (time: string) => set({ lastSyncTime: time }),
  
  // 同步角色数据
  syncCharacters: async (uid: string, forceUpdate: boolean = false) => {
    set({ isSyncing: true, syncError: null })
    
    try {
      const result = await userDataAPI.syncCharacters({ uid, force_update: forceUpdate })
      
      set({ 
        lastSyncTime: result.sync_time,
        isSyncing: false 
      })
      
      // 同步成功后刷新角色数据
      await get().getCharacters(uid)
      
      Taro.showToast({
        title: `同步完成！新增${result.characters_new}个角色，更新${result.characters_updated}个角色`,
        icon: 'success',
        duration: 3000
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      set({ syncError: errorMessage, isSyncing: false })
      
      Taro.showToast({
        title: errorMessage,
        icon: 'error'
      })
      
      throw error
    }
  },
  
  // 获取角色数据
  getCharacters: async (uid?: string) => {
    try {
      const characters = await userDataAPI.getCharacters(uid)
      
      set({ characters })
    } catch (error) {
      const errorMessage = handleApiError(error)
      set({ syncError: errorMessage })
      throw error
    }
  },
  
  // 切换角色收藏状态
  toggleCharacterFavorite: async (uid: string, characterId: string, isFavorite: boolean) => {
    try {
      await userDataAPI.toggleCharacterFavorite(uid, characterId, isFavorite)
      
      // 更新本地数据
      const state = get()
      const updatedCharacters = state.characters.map(char => 
        char.uid === uid && char.character_id === characterId 
          ? { ...char, is_favorite: isFavorite }
          : char
      )
      
      set({ characters: updatedCharacters })
      
      Taro.showToast({
        title: isFavorite ? '已添加到收藏' : '已取消收藏',
        icon: 'success'
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      Taro.showToast({
        title: errorMessage,
        icon: 'error'
      })
      throw error
    }
  },
  
  // 删除角色数据
  deleteCharacter: async (uid: string, characterId: string) => {
    try {
      await userDataAPI.deleteCharacter(uid, characterId)
      
      // 更新本地数据
      const state = get()
      const updatedCharacters = state.characters.filter(char => 
        !(char.uid === uid && char.character_id === characterId)
      )
      
      set({ characters: updatedCharacters })
      
      Taro.showToast({
        title: '角色数据删除成功',
        icon: 'success'
      })
    } catch (error) {
      const errorMessage = handleApiError(error)
      Taro.showToast({
        title: errorMessage,
        icon: 'error'
      })
      throw error
    }
  },
  
  clearSyncData: () => {
    set({
      characters: [],
      isSyncing: false,
      lastSyncTime: null,
      syncError: null
    })
  }
}))

// 导出钩子函数
export const useUser = () => useUserStore()
export const useUserData = () => useUserDataStore()