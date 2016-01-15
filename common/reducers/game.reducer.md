Game Reducer Shape
==================

The game reducer holds all state data needed to compute the state of the Game
component and sub-components.

Here is its state tree:

```
  id:       < String >
  title:    < String >
  status:   < String, enum: 'waiting', 'in_progress', 'complete', 'abandoned' >
  isMyTurn: < Boolean >
  board: [
    < Tile object (see below) >
  ]
  rack: [
    { < Tile object > }
  ]
  swap: {
    swapping: < Boolean >
    bucket: [
      < Tile object >
    ]
  }
  bonusSquares: [
    {
      id: < String >
      x:  < Integer >
      y:  < Integer >
      label: < String >
      effect: < Effect object >
      // Some example effect objects:
      // { tileMultiplier: 2 }
      // { wordMultiplier: 3 }
      // { tileMultiplier: 0.5, wordMultiplier: 4 }
    }
  ]
  turns: [
    {
      id: < String >
      word: < String >
      points: < Integer >
      playerId: < String >
    }
  ]
  players: [
    {
      id:           < String >
      username:     < String >
      profilePhoto: < String >
      currentUser:  < Boolean >
    }
  ]


```

Here's the Tile object, which exists in 3 separate arrays:

```
  {
    id:       < String >
    points:   < Integer >
    letter:   < String >
    x:        < Integer >
    y:        < Integer >
    turnId:   < Integer, optional >
    playerId: < String>
    belongsToCurrentUser: < Boolean >
  }, {
    ... etc
  }
```
