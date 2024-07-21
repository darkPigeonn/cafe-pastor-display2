import { defineStore } from 'pinia'

interface AppState {
  alertVisible: boolean;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    alertVisible: false,
  }),
  actions: {
    setAlertVisible(visible: boolean) {
      this.alertVisible = visible;
    },
  },
})
