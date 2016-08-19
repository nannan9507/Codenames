import Game from './components/game.vue'

export function routeMap(router) {
  router.map({
    '/': {
      component: Game
    },
  });
  router.redirect({
    '*': '/'
  })
}