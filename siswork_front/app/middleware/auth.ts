export default defineNuxtRouteMiddleware(() => {
  if (!import.meta.client) return

  const token = window.localStorage.getItem('access_token')

  if (!token) {
    return navigateTo('/login')
  }
})