import Axios from 'axios'

export default {
  state: {
    user: null,
    jwt: null
  },
  mutations: {
    registerUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    unregisterUserFromMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      // debugger
      state.user = payload
    },
    setJWT (state, payload) {
      state.jwt = payload.token
    }
  },
  actions: {
    loadMeetups ({commit, state}, payload) {
      console.log('loadMeetups called inside of User')
    },
    registerUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      // const user = getters.user

      /* firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, fbKey: data.key})
        })
        .catch(error => {
          console.log('registerUserForMeetup action catch, ' + error)
          commit('setLoading', false)
        }) */
    },
    unregisterUserFromMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      // const fbKey = user.fbKeys[payload]
      console.log('unregisterUserFromMeetup action fbKey: ' + JSON.stringify(payload))
      /* firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        }) */
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')

      var axiosConfig = {
        headers: {'Content-Type': 'application/json;charset=UTF-8'}
      }

      var userData = {
        email: payload.email,
        password: payload.password
      }

      debugger

      Axios.post('http://localhost:3000/user/signup', userData, axiosConfig)
      .then(function (response) {
        // debugger
        commit('setLoading', false)
        const newUser = {
          id: response.data.id,
          email: response.data.email,
          registeredMeetups: [],
          fbKeys: {}
        }
        commit('setUser', newUser)
        console.log('POST create user succeed! ' + response)
      })
      .catch(function (error) {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
        console.log('POST create user failed: ' + error)
      })

      /* firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        ) */
    },
    signUserIn (context, payload) {
      const commit = context.commit
      commit('setLoading', true)
      commit('clearError')

      Axios.post('http://localhost:3000/user/login', payload)
      .then(function (response) {
        commit('setLoading', false)
        /* const newToken = {
          token: response.data.token
        }
        // commit('setJWT', newToken) */

        const newUser = {
          id: response.data.uid,
          token: response.data.token,
          registeredMeetups: [],
          fbKeys: {}
        }
        commit('setUser', newUser)

        // debugger
        context.dispatch('loadMeetups')

        console.log(response)
      })
      .catch(function (error) {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })

      /* firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        ) */
    },
    backendConnect (context, payload) {
      var commit = context.commit
      // var state = context.state
      commit('setLoading', true)
      commit('clearError')

      // debugger

      Axios.post('http://localhost:3000/user/login', payload)
      .then(function (response) {
        commit('setLoading', false)
        const newToken = {
          token: response.data.token
        }
        commit('setJWT', newToken)
        // debugger
        context.dispatch('loadMeetups')

        console.log(response)
      })
      .catch(function (error) {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
    },
    /* autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: [], fbKeys: {}})
    }, */
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      /* firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
        .then(data => {
          const dataPairs = data.val()
          let registeredMeetups = []
          let swappedPairs = {}
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key])
            swappedPairs[dataPairs[key]] = key
          }
          // console.log(registeredMeetups)
          // console.log(swappedPairs)

          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          }
          commit('setLoading', false)
          commit('setUser', updatedUser)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        }) */
    },
    logout ({commit}) {
      // firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    jwt (state) {
      return state.jwt
    }
  }
}
