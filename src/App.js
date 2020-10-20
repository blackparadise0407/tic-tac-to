import React, { useCallback, useEffect, useRef, useState } from 'react';
import { includes, map } from 'lodash'
import { Card, Square } from './components'
import Input from './components/Input';
import IconList from './assets/iconList';


const Icon = ({ chooseIcon = () => { }, item }) => {
  const [picked, setPicked] = useState(false)
  return (
    <p
      onClick={() => {
        chooseIcon(item)
        setPicked(!picked)
      }}
      className={'icon' + (picked ? ' icon--active' : '')}
    >
      {item}
    </p>
  )
}

const App = () => {
  // Setting up the board
  const [board, setBoard] = useState(Array(9).fill(null))
  const [history, setHistory] = useState([
    {
      square: Array(9).fill(null)
    }
  ])
  // Check if game is draw
  let isDraw = useRef(0)

  const [XTurn, setXTurn] = useState(true)
  const [winner, setWinner] = useState(null)
  const [step, setStep] = useState(0)
  const [flag, setFlag] = useState(false)

  // Check if there is a winner
  const checkWin = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[b] && board[c] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }
  const [gameState, setGameState] = useState({
    player1: '',
    // icon1: '🚀',
    icon1: '',
    player2: '',
    icon2: '',
    gameReady: false
  })

  const handleChange = (e) => {
    setGameState({
      ...gameState,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    const { player1, player2, icon1, icon2 } = gameState;
    if (!player1 || !player2 || !icon1 || !icon2) {
      alert('Please enter all player\'s name and choose icons')
      return
    }
    setGameState({
      ...gameState,
      gameReady: true
    })
  }

  const handleClick = (i) => {
    const gameHistory = history.slice(0, step + 1)
    const newBoard = [...board]
    if (checkWin(newBoard) || newBoard[i]) {
      return;
    }
    isDraw.current += 1
    newBoard[i] = XTurn ? gameState.icon1 : gameState.icon2
    setXTurn(!XTurn)
    setBoard(newBoard)
    if (flag) {
      setHistory([...gameHistory, { square: newBoard }])
      setFlag(false)
      return
    }
    setFlag(false)

    let myHistory = [...history]
    let save = myHistory.concat([{
      square: newBoard,
    }])
    setStep(history.length)
    setHistory(save)
  }
  const renderSquare = (i) => {
    return (<Square data={board[i]} onClick={() => handleClick(i)} />)
  }

  // Restart the game function
  const restart = () => {
    setBoard(Array(9).fill(null))
    setHistory([
      {
        square: Array(9).fill(null)
      }
    ])
  }

  const goToMove = (step) => {
    setStep(step)
    setXTurn(step % 2 === 0)
    setBoard(history[step].square)
    setFlag(true)
  }

  const exit = () => {
    window.location.reload()
  }

  const chooseIcon = (data) => {
    const { icon1, icon2 } = gameState;
    if (icon1 && icon2) return
    if (icon1) {
      if (data === icon1) {
        setGameState({
          ...gameState,
          icon1: ''
        })
        return
      }
      setGameState({
        ...gameState,
        icon2: data
      })
      return
    }
    setGameState({
      ...gameState,
      icon1: data
    })
    return
  }

  useEffect(() => {
    setWinner(checkWin(board))
    if (winner) { isDraw.current = 0 }
    if (!includes(board, null)) {
      if (checkWin(board)) { setWinner(checkWin(board)) }
      else setWinner('DRAW')
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkWin])


  const { player1, player2, icon1, icon2, gameReady } = gameState
  return (
    <div className='App'>
      {!gameReady &&
        <>
          <div className="left">
            {icon1 && icon2 ?
              null :
              <div className="icon-picker">
                <div className="title">
                  Choose your favourite icon<br />
            Player 1 choose first
            </div>
                <div className="main">
                  {map(IconList, (item, index) => <Icon
                    chooseIcon={chooseIcon}
                    key={index}
                    item={item}
                  >
                  </Icon>)}
                </div>
              </div>
            }
          </div>
        </>
      }

      <div className="mid">
        {!gameReady && <div className="player">
          <form onSubmit={handleSubmit}>
            <Input
              label='Player 1'
              name='player1'
              type="text"
              value={player1}
              onChange={handleChange} />
            <Input
              label='Player 2'
              name='player2'
              type="text"
              value={player2}
              onChange={handleChange} />
            <button type='submit'>OK</button>
          </form>
        </div>}
        <>{gameReady &&
          <>
            {winner ? <>{winner === 'DRAW' ? <p className="declare">🏳️🏳️DRAW🏳️🏳️</p> : <p className='declare'> 🎉🎉The winner is <span>{winner === icon1 ? player1 : player2}</span> 🎉🎉 </p>}</> : null}
            <div className={'Board' + (winner ? ' disabled' : '')}>
              <div className="Board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
              </div>
              <div className="Board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
              </div>
              <div className="Board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
              </div>
            </div>
            {!winner && <p className='turn'>{XTurn ? `${icon1} ${player1}` : ` ${icon2} ${player2}`} turn</p>}
            {winner ? <button
              className='btn'
              onClick={restart}
            >
              {winner === 'DRAW' ? 'rematch' : 'replay'}</button> : null}
            {winner && <button className='btn' onClick={exit}>exit</button>}
          </>
        }
        </>
      </div>
      {gameReady && <div className="right">
        <div className="card">
          <div className="header">Previous moves</div>
          <div className="body">
            {history &&
              map(history, (item, index) => (<>
                {index === 0 ?
                  <Card index={index} key={index} item={item} func={() => goToMove(0)} />
                  :
                  <Card index={index} key={index} item={item} func={() => goToMove(index)} />
                }
              </>))
            }
          </div>
        </div>
      </div>}

    </div>
  );
}

export default App;
