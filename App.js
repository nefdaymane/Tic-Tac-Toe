import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Lignes verticales
    [0, 4, 8], [2, 4, 6], // Diagonales
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Retourne le joueur gagnant ('X' ou 'O')
    }
  }

  if (!board.includes(null)) {
    return 'tie';
  }

  return null;
};

const minimax = (board, player) => {
  const winner = checkWinner(board);
  if (winner === 'X') return { score: 1 };
  if (winner === 'O') return { score: -1 };
  if (winner === 'tie') return { score: 0 };

  let moves = [];

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      board[i] = player;
      const result = minimax(board, player === 'X' ? 'O' : 'X');
      moves.push({
        score: player === 'X' ? result.score : -result.score,
        move: i,
      });
      board[i] = null;
    }
  }

  let bestMove;
  if (player === 'X') {
    bestMove = Math.min(...moves.map((move) => move.score));
    bestMove = moves.find((move) => move.score === bestMove);
  } else {
    bestMove = Math.max(...moves.map((move) => move.score));
    bestMove = moves.find((move) => move.score === bestMove);
  }

  return bestMove;
};

const App = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState('X');
  const [gameOver, setGameOver] = useState(false);
  const [gameMode, setGameMode] = useState(null);

  const handleMove = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      if (winner === 'tie') {
        Alert.alert('Match nul !');
      } else {
        Alert.alert(`Le joueur ${winner} a gagné !`);
      }
      setGameOver(true);
    } else {
      setPlayer(player === 'X' ? 'O' : 'X');

      if (gameMode === 'computer' && player === 'X' && !gameOver) {
        setTimeout(() => {
          const bestMove = minimax(newBoard, 'O').move;
          newBoard[bestMove] = 'O';
          setBoard(newBoard);

          const computerWinner = checkWinner(newBoard);
          if (computerWinner) {
            if (computerWinner === 'tie') {
              Alert.alert('Match nul !');
            } else {
              Alert.alert('L\'ordinateur a gagné !');
            }
            setGameOver(true);
          } else {
            setPlayer('X');
          }
        }, 500);
      }
    }
  };

  const renderSquare = (index) => (
    <TouchableOpacity
      key={index}
      style={styles.square}
      onPress={() => handleMove(index)}
      disabled={board[index] || gameOver}
    >
      <Text style={styles.text}>{board[index]}</Text>
    </TouchableOpacity>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer('X');
    setGameOver(false);
  };

  const startGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  const returnToHome = () => {
    setGameMode(null);
    resetGame();
  };

  if (gameMode === null) {
    return (
      <View style={styles.container}>
        <Image source={require('./assets/tictactoe.png')} style={{ width: 200, height: 200 }} />
        <Text style={styles.title}>Tic Tac Toe</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={() => startGame('2players')}>
            <Text style={styles.buttonText}>2 Joueurs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => startGame('computer')}>
            <Text style={styles.buttonText}>Contre l'ordinateur</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={[styles.board, styles.boardShadow]}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderSquare(index))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={resetGame}>
          <Text style={styles.buttonText}>Rejouer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={returnToHome}>
          <Text style={styles.buttonText}>Retour à l'accueil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1D1D1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  boardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  square: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    width: 250,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    marginBottom: 15
  },
  buttonPrimary: {
    backgroundColor: '#9400d3',
  },
  buttonSecondary: {
    backgroundColor: '#00bfff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
