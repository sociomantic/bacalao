var keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    RECEIVE_RAW_EVENTS: null,
    CHANGE_ROUTE: null,
    GOT_LOCATION: null,
    INIT_USER: null,
    CREATE_EVENT: null,
    CREATED_EVENT: null,
    JOIN_EVENT: null,
    JOINED_EVENT: null,
    LEAVE_EVENT: null,
    LEFT_EVENT: null,
    REMOVED_EVENT: null,
    GOT_USER_INFO: null
  }),

  /**
   * Routes object
   *
   * the actual routes are the values
   */
  Routes: {
    landing: '',
    welcome: 'welcome',
    newEvent: 'event/new'
  },


  Endpoints: {
    LOGOUT: '/api/user',
    ME: '/api/me',
    EVENT: '/api/event',
    DELETE_EVENT: '/api/event/[eventId]',
    EVENTS: '/api/events',
    JOIN_EVENT: '/api/event/[eventId]/attendees',
    LEAVE_EVENT: '/api/event/[eventId]/attendees'
  }

  // PayloadSources: keyMirror({
  //   SERVER_ACTION: null,
  //   VIEW_ACTION: null
  // })

};
