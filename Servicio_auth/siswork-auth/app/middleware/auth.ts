export default defineNuxtRouteMiddleware((to) => {
  const isAuthenticated = false

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})