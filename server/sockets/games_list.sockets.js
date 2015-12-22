import * as Actions from '../../common/constants/actions.constants';

export default function(io) {
  io.on('connection', (socket) => {
    // Send the user the initial list of games
    const games = [
      {
        _id: 1,
        createdAt: '2015-12-21T16:00:00-05:00',
        title: 'Wording Around',
        status: 'playing',
        players: [{
          _id: '123',
          username: 'Susan Smithy',
          profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-03.png'
        }, {
          _id: '456',
          username: 'Johnny Ive',
          profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-01.png'
        }]
      }, {
        _id: 2,
        createdAt: '2015-12-21T15:54:12-05:00',
        title: 'Come spell!',
        status: 'waiting',
        players: [{
          _id: '789',
          username: 'Spellington',
          profilePhoto: 'https://s3.amazonaws.com/wordswithstrangers/animal-02.png'
        }]
      }

    ];

    socket.emit(Actions.ADD_GAMES_TO_LIST, games);



  })



}
