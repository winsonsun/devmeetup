import Axios from 'axios'

export default {
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
        id: 'afajfjadfaadfa323',
        name: 'Meetup in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg',
        id: 'aadsfhbkhlk1241',
        name: 'Meetup in Paris',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }
    ]
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      // debugger
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      // debugger
      state.loadedMeetups.push(payload)
    },
    updateMeetup (state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if (payload.title) {
        meetup.title = payload.title
      }
      if (payload.description) {
        meetup.description = payload.description
      }
      if (payload.date) {
        meetup.date = payload.date
      }
    }
  },
  actions: {
    loadMeetups ({commit}) {
      // debugger
      commit('setLoading', true)

      var jwt = this.getters.user.token
      var config = {
        headers: {'Authorization': 'Bearer ' + jwt}
      }

      debugger

      Axios.get('http://localhost:3000/products', config)
      .then(function (data) {
        // debugger
        const meetups = []
        const obj = data.data.products
        obj.forEach((o) => {
          // debugger
          meetups.push({
            id: o._id,
            name: o.name,
            price: o.price,
            imageUrl: 'http://localhost:3000/' + o.productImage
          })
        })

        commit('setLoadedMeetups', meetups)
        commit('setLoading', false)
        console.log(data)
      })
      .catch(function (error) {
        // debugger
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
    },
    createMeetup ({commit, getters}, payload) {
      // debugger
      const product = {
        name: payload.name,
        price: parseInt(payload.price),
        productImage: payload.image
      }
      console.log(product.name)

      /* var axiosConfig = {
        'Content-Type': 'application/json;charset=UTF-8',
        headers: {'Authorization': 'Bearer ' + this.getters.user.token}
      } */

      var axiosConfig = {
        'Content-Type': 'application/x-www-form-urlencoded',
        headers: {'Authorization': 'Bearer ' + this.getters.user.token}
      }

      const formData = new FormData()
      formData.append('file', this.image)
      formData.append('name', product.name)
      formData.append('price', product.price)
      formData.append('productImage', payload.image)

      debugger

      const url = 'http://localhost:3000/products'
      Axios.post(url, formData, axiosConfig)
      .then(function (response) {
        // handle success
        console.log('POST product succeed' + response)
      })
      .catch(function (response) {
        // handle error
        console.log('POST product failed' + response)
      })
    },
    updateMeetupData ({commit}, payload) {
      commit('setLoading', false)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
    }
  },
  getters: {
    loadedMeetups (state) {
      // return state.loadedMeetups.sort((meetupA, meetupB) => {
      //   return meetupA.date > meetupB.date
      // })
      return state.loadedMeetups
    },
    featuredMeetups (state, getters) {
      // debugger
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    }
  }
}
