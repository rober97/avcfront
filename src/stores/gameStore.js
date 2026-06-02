import { defineStore } from 'pinia'
import axios from 'axios'
import { useGlobal } from './global'

export const useGameStore = defineStore('game', {
  state: () => ({
    playerStats: {
      level: 26,
      xp: 2450,
      xpMax: 5000,
      health: 20,
      healthMax: 20,
      money: 15430,
      playedTime: '156h',
      playedTimeMinutes: '23m',
      rank: 'Caballero',
      rankTier: 'II',
      alignment: 75,
      alignmentPath: 'Héroe',
    },
    missions: {
      active: [
        {
          id: 1,
          title: 'La Amenaza del Nether',
          description: 'Derrota a 10 Blazes en la Fortaleza del Nether.',
          progress: 6,
          total: 10,
          reward: 2500,
          icon: '🔥',
          type: 'combat'
        },
        {
          id: 2,
          title: 'Guardianes del Pueblo',
          description: 'Protege tu ciudad de 5 invasiones.',
          progress: 2,
          total: 5,
          reward: 1800,
          icon: '🛡️',
          type: 'defense'
        },
        {
          id: 3,
          title: 'Recolector Experto',
          description: 'Recolecta 1,000 de cada mineral.',
          progress: 650,
          total: 1000,
          reward: 3000,
          icon: '⛏️',
          type: 'gathering'
        },
        {
          id: 4,
          title: 'Pesca Legendaria',
          description: 'Pesca un pez legendario.',
          progress: 0,
          total: 1,
          reward: 2200,
          icon: '🎣',
          type: 'fishing'
        }
      ],
      available: [
        {
          id: 5,
          title: 'Explorador de Cavernas',
          description: 'Explora 3 cavernas de lush caves.',
          progress: 0,
          total: 3,
          reward: 1500,
          icon: '🕯️',
          type: 'exploration'
        },
        {
          id: 6,
          title: 'Constructor Maestro',
          description: 'Construye una estructura de más de 500 bloques.',
          progress: 0,
          total: 500,
          reward: 2000,
          icon: '🏗️',
          type: 'building'
        }
      ],
      completed: [
        {
          id: 7,
          title: 'Primer Diamante',
          description: 'Encuentra tu primer diamante.',
          progress: 1,
          total: 1,
          reward: 500,
          icon: '💎',
          type: 'gathering'
        }
      ],
      daily: [
        {
          id: 101,
          title: 'Inicia sesión',
          progress: 1,
          total: 1,
          reward: 500,
          completed: true
        },
        {
          id: 102,
          title: 'Mina 100 bloques',
          progress: 67,
          total: 100,
          reward: 300,
          completed: false
        },
        {
          id: 103,
          title: 'Pesca 10 peces',
          progress: 3,
          total: 10,
          reward: 250,
          completed: false
        }
      ]
    },
    nextEvent: {
      title: 'Guerras de Clanes',
      description: 'Participa y gana recompensas épicas.',
      timeRemaining: '2h 45m',
    },
    profileStats: {
      money: 15430,
      kills: 1247,
      deaths: 342,
      blocksMined: 128456,
      fishCaught: 2341,
      missionsCompleted: 57,
    },
    rankings: {
      level: 15,
      money: 8,
      kills: 23,
    },
    equipment: {
      helmet: { name: 'Casco de Diamante', icon: '🪖' },
      chestplate: { name: 'Pechera de Netherite', icon: '🛡️' },
      leggings: { name: 'Pantalones de Diamante', icon: '👖' },
      boots: { name: 'Botas de Netherite', icon: '👢' },
      mainHand: { name: 'Espada de Netherite', icon: '⚔️' },
      offHand: { name: 'Escudo', icon: '🛡️' },
    },
    recentAchievements: [
      { name: 'Cazador de Dragones', description: 'Derrota al Ender Dragon', points: 90, icon: '🐉' },
      { name: 'Maestro Constructor', description: 'Construye 100 estructuras', points: 30, icon: '🏠' },
      { name: 'Explorador', description: 'Visita todos los biomas', points: 20, icon: '🗺️' },
    ]
  }),

  actions: {
    async fetchPlayerStats() {
      try {
        const global = useGlobal()
        const res = await axios.get(`${global.url_api}/player-stats`)
        if (res.data) {
          this.playerStats = { ...this.playerStats, ...res.data }
        }
      } catch (error) {
        console.log('Using default player stats')
      }
    },

    async fetchMissions() {
      try {
        const global = useGlobal()
        const res = await axios.get(`${global.url_api}/missions`)
        if (res.data) {
          this.missions = res.data
        }
      } catch (error) {
        console.log('Using default missions')
      }
    },

    async fetchProfileStats() {
      try {
        const global = useGlobal()
        const res = await axios.get(`${global.url_api}/profile-stats`)
        if (res.data) {
          this.profileStats = res.data
        }
      } catch (error) {
        console.log('Using default profile stats')
      }
    }
  }
})
