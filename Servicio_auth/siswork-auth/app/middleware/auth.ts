export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('access_token')

  if (!token) {
    return navigateTo('/login')
  }
})