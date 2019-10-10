class Board {
	constructor(
		top_left,
		top_center,
		top_right,
		middle_left,
		middle_center,
		middle_right,
		bottom_left,
		bottom_center,
		bottom_right
	) {
		this.top_left = top_left;
		this.top_center = top_center;
		this.top_right = top_right;
		this.middle_left = middle_left;
		this.middle_center = middle_center;
		this.middle_right = middle_right;
		this.bottom_left = bottom_left;
		this.bottom_center = bottom_center;
		this.bottom_right = bottom_right;
		this.clear = function() {
			const list = document.getElementsByClassName("squares");
			for (let i = 0; i < list.length; i++) {
				list[i].innerHTML = "";
			}
		};
		this.fillSquareX = function(square) {
			document.getElementById(square).innerHTML = "X";
		};
		this.fillSquareO = function(square) {
			document.getElementById(square).innerHTML = "O";
		};
	}
}

class Player {
	constructor(name, points) {
		this.name = name;
		this.points = points;
		this.addPoint = function() {
			points = points + 1;
		};
	}
	get playerPoints() {
		return this.points;
	}
}

// Used for selecting a random spot when AI has no easy choice
const ticTacDict = [
	{
		squareName: "top_left",
		squareNumber: 0
	},
	{
		squareName: "top_center",
		squareNumber: 1
	},
	{
		squareName: "top_right",
		squareNumber: 2
	},
	{
		squareName: "middle_left",
		squareNumber: 3
	},
	{
		squareName: "middle_center",
		squareNumber: 4
	},
	{
		squareName: "middle_right",
		squareNumber: 5
	},
	{
		squareName: "bottom_left",
		squareNumber: 6
	},
	{
		squareName: "bottom_center",
		squareNumber: 7
	},
	{
		squareName: "bottom_right",
		squareNumber: 8
	}
];

let turnCounter = 0;
let isGameOver = false;
let p1points = 0;
let p2points = 0;
let gameMode = "Single Player";
let lastAIChoice = "";
let isAIThinking = false;

const gameBoard = new Board();
const playerOne = new Player("Player One", 0); //Will always have Xs
const playerTwo = new Player("Player Two", 0); //Will always have Os
const aiPlayer = new Player("The AI", 0);

let currentPlayer = playerOne;

// Changes button text when game mode changes
function changeGameMode() {
	if (gameMode === "Single Player") {
		gameMode = "Two Player";
		document.getElementById("gameModeButton").innerHTML = "Two Player";
	} else {
		gameMode = "Single Player";
		document.getElementById("gameModeButton").innerHTML = "Single Player";
	}
}

// Change background on hover execpt when the win is highlighted
function bgChange(id, color) {
	if (document.getElementById(id).style.backgroundColor != "red") {
		document.getElementById(id).style.background = color;
	}
}

// Reset the board
myReset = function() {
	turnCounter = 0;
	gameBoard.clear();
	isGameOver = false;
	let test = document.getElementsByClassName("squares");
	// Change all squares back to orange
	// Prevents highlighting for some reason
	for (i = 0; i < test.length; i++) {
		test[i].style.backgroundColor = "orange";
	}
};

// Main game function
// Fill in selected square with X or O
fillTheSquare = function(square) {
	// Prevent filling if a square is already occupied
	if (document.getElementById(square).innerHTML === "") {
		if (gameMode === "Two Player") {
			if (currentPlayer === playerOne) {
				gameBoard.fillSquareX(square);
				turnCounter++;
				checkForGameOver(square, playerOne);
				currentPlayer = playerTwo;
				if (turnCounter >= 9 && isGameOver === false) {
					gameOver("tie");
				}
			} else if (currentPlayer === playerTwo) {
				gameBoard.fillSquareO(square);
				turnCounter++;
				checkForGameOver(square, playerTwo);
				if (turnCounter >= 9 && isGameOver === false) {
					gameOver("tie");
				}
				currentPlayer = playerOne;
			}
		} else if (isAIThinking === false && isGameOver === false) {
			gameBoard.fillSquareX(square);
			turnCounter++;
			checkForGameOver(square, playerOne);
			if (turnCounter >= 9 && isGameOver === false) {
				gameOver("tie");
			}
			// Begin AI process
			isAIThinking = true;
			let aiAction = document.getElementById("whatIsAIDoing");
			aiAction.innerHTML = "AI is thinking...";
			aiAction.style.backgroundColor = "red";
			aiAction.style.color = "white";
			setTimeout(function() {
				runAI(square, lastAIChoice);
				isAIThinking = false;
				aiAction.innerHTML = "AI is waiting";
				aiAction.style.backgroundColor = "white";
				aiAction.style.color = "black";
			}, 1000);
		}
	}
};

// Fire game over message and update points
gameOver = function(player) {
	if (player === "tie") {
		Swal.fire("Game Over!", "The game has resulted in a tie!", "success");
	} else {
		Swal.fire("Game Over!", player.name + " has won!", "success");
		if (player === playerOne) {
			p1points++;
		} else {
			p2points++;
		}
	}
	document.getElementById("p1points").innerHTML =
		"Player One points: " + p1points;
	document.getElementById("p2points").innerHTML =
		"Player Two points: " + p2points;
	isGameOver = true;
};

// Main logic for AI
runAI = function(playerPickedSquare, prevAIChoice) {
	if (isGameOver === false) {
		let choice = "";

		// Use common tactics to prevent winning on second turn
		if (turnCounter === 1 && playerPickedSquare != "middle_center") {
			choice = "middle_center";
		} else if (turnCounter === 1) {
			choice = "top_right";
		}

		// AI will try to win, then block, otherwise it is random
		switch (prevAIChoice) {
			case "top_left":
				// CHECKING FOR ROW WINS
				if (
					document.getElementById("top_center").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("top_center").innerHTML === ""
				) {
					choice = "top_center";
					// CHECKING FOR COLUMN WINS
				} else if (
					document.getElementById("middle_left").innerHTML === "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
				} else if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("middle_left").innerHTML === ""
				) {
					choice = "middle_left";
					// CHECKING FOR DIAGONAL WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
			case "top_center":
				// CHECK FOR ROW WINS
				if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
					// CHECK FOR COLUMN WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("bottom_center").innerHTML === ""
				) {
					choice = "bottom_center";
				} else if (
					document.getElementById("bottom_center").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
			case "top_right":
				// CHECK ROW WINS
				if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("top_center").innerHTML === ""
				) {
					choice = "top_center";
				} else if (
					document.getElementById("top_center").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
					// CHECK COLUMN WINS
				} else if (
					document.getElementById("middle_right").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("middle_right").innerHTML === ""
				) {
					choice = "middle_right";
					// CHECKING FOR DIAGONAL WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
				} else if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
			case "middle_left":
				// CHECK ROW WINS
				if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("middle_right").innerHTML === ""
				) {
					choice = "middle_right";
				} else if (
					document.getElementById("middle_right").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
					//CHECK COLUMN WINS
				} else if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
				} else if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
				} else {
					break;
				}
				break;
			case "middle_center":
				// CHECK ROW WINS
				if (
					document.getElementById("middle_left").innerHTML === "O" &&
					document.getElementById("middle_right").innerHTML === ""
				) {
					choice = "middle_right";
				} else if (
					document.getElementById("middle_right").innerHTML === "O" &&
					document.getElementById("middle_left").innerHTML === ""
				) {
					choice = "middle_left";
					// CHECK COLUMN WINS
				} else if (
					document.getElementById("top_center").innerHTML === "O" &&
					document.getElementById("bottom_center").innerHTML === ""
				) {
					choice = "bottom_center";
				} else if (
					document.getElementById("bottom_center").innerHTML === "O" &&
					document.getElementById("top_center").innerHTML === ""
				) {
					choice = "top_center";
					// CHECKING FOR DIAGONAL WINS
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
				} else if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
				} else if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
				} else {
					break;
				}
				break;
			case "middle_right":
				// CHECK ROW WINS
				if (
					document.getElementById("middle_left").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("middle_left").innerHTML === ""
				) {
					choice = "middle_left";
					// CHECK COLUMN WINS
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
				} else {
					break;
				}
				break;
			case "bottom_left":
				// CHECK ROW WINS
				if (
					document.getElementById("bottom_center").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("bottom_center").innerHTML === ""
				) {
					choice = "bottom_center";
					// CHECK COLUMN WINS
				} else if (
					document.getElementById("middle_left").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
				} else if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("middle_left").innerHTML === ""
				) {
					choice = "middle_left";
					// CHECKING FOR DIAGONAL WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
			case "bottom_center":
				// CHECK ROW FOR WINS
				if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("bottom_right").innerHTML === ""
				) {
					choice = "bottom_right";
				} else if (
					document.getElementById("bottom_right").innerHTML === "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
					// CHECK COLUMN FOR WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("top_center").innerHTML === ""
				) {
					choice = "top_center";
				} else if (
					document.getElementById("top_center").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
			case "bottom_right":
				// CHECK ROW FOR WINS
				if (
					document.getElementById("bottom_left").innerHTML === "O" &&
					document.getElementById("bottom_center").innerHTML === ""
				) {
					choice = "bottom_center";
				} else if (
					document.getElementById("bottom_center").innerHTML == "O" &&
					document.getElementById("bottom_left").innerHTML === ""
				) {
					choice = "bottom_left";
					// CHECK COLUMN FOR WINS
				} else if (
					document.getElementById("top_right").innerHTML === "O" &&
					document.getElementById("middle_right").innerHTML === ""
				) {
					choice = "middle_right";
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("top_right").innerHTML === ""
				) {
					choice = "top_right";
					// CHECKING FOR DIAGONAL WINS
				} else if (
					document.getElementById("middle_center").innerHTML === "O" &&
					document.getElementById("top_left").innerHTML === ""
				) {
					choice = "top_left";
				} else if (
					document.getElementById("top_left").innerHTML === "O" &&
					document.getElementById("middle_center").innerHTML === ""
				) {
					choice = "middle_center";
				} else {
					break;
				}
				break;
		}

		if (choice === "") {
			choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
			switch (playerPickedSquare) {
				// Use last box clicked to check for possible wins
				case "top_left":
					// CHECKING FOR ROW WINS
					if (
						document.getElementById("top_center").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("top_center").innerHTML === ""
					) {
						choice = "top_center";
						// CHECKING FOR COLUMN WINS
					} else if (
						document.getElementById("middle_left").innerHTML === "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
					} else if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("middle_left").innerHTML === ""
					) {
						choice = "middle_left";
						// CHECKING FOR DIAGONAL WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "top_center":
					// CHECK FOR ROW WINS
					if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
						// CHECK FOR COLUMN WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("bottom_center").innerHTML === ""
					) {
						choice = "bottom_center";
					} else if (
						document.getElementById("bottom_center").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "top_right":
					// CHECK ROW WINS
					if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("top_center").innerHTML === ""
					) {
						choice = "top_center";
					} else if (
						document.getElementById("top_center").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
						// CHECK COLUMN WINS
					} else if (
						document.getElementById("middle_right").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("middle_right").innerHTML === ""
					) {
						choice = "middle_right";
						// CHECKING FOR DIAGONAL WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
					} else if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "middle_left":
					// CHECK ROW WINS
					if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("middle_right").innerHTML === ""
					) {
						choice = "middle_right";
					} else if (
						document.getElementById("middle_right").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
						//CHECK COLUMN WINS
					} else if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
					} else if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "middle_center":
					// CHECK ROW WINS
					if (
						document.getElementById("middle_left").innerHTML === "X" &&
						document.getElementById("middle_right").innerHTML === ""
					) {
						choice = "middle_right";
					} else if (
						document.getElementById("middle_right").innerHTML === "X" &&
						document.getElementById("middle_left").innerHTML === ""
					) {
						choice = "middle_left";
						// CHECK COLUMN WINS
					} else if (
						document.getElementById("top_center").innerHTML === "X" &&
						document.getElementById("bottom_center").innerHTML === ""
					) {
						choice = "bottom_center";
					} else if (
						document.getElementById("bottom_center").innerHTML === "X" &&
						document.getElementById("top_center").innerHTML === ""
					) {
						choice = "top_center";
						// CHECKING FOR DIAGONAL WINS
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
					} else if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
					} else if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "middle_right":
					// CHECK ROW WINS
					if (
						document.getElementById("middle_left").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("middle_left").innerHTML === ""
					) {
						choice = "middle_left";
						// CHECK COLUMN WINS
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "bottom_left":
					// CHECK ROW WINS
					if (
						document.getElementById("bottom_center").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("bottom_center").innerHTML === ""
					) {
						choice = "bottom_center";
						// CHECK COLUMN WINS
					} else if (
						document.getElementById("middle_left").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
					} else if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("middle_left").innerHTML === ""
					) {
						choice = "middle_left";
						// CHECKING FOR DIAGONAL WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "bottom_center":
					// CHECK ROW FOR WINS
					if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("bottom_right").innerHTML === ""
					) {
						choice = "bottom_right";
					} else if (
						document.getElementById("bottom_right").innerHTML === "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
						// CHECK COLUMN FOR WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("top_center").innerHTML === ""
					) {
						choice = "top_center";
					} else if (
						document.getElementById("top_center").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
				case "bottom_right":
					// CHECK ROW FOR WINS
					if (
						document.getElementById("bottom_left").innerHTML === "X" &&
						document.getElementById("bottom_center").innerHTML === ""
					) {
						choice = "bottom_center";
					} else if (
						document.getElementById("bottom_center").innerHTML == "X" &&
						document.getElementById("bottom_left").innerHTML === ""
					) {
						choice = "bottom_left";
						// CHECK COLUMN FOR WINS
					} else if (
						document.getElementById("top_right").innerHTML === "X" &&
						document.getElementById("middle_right").innerHTML === ""
					) {
						choice = "middle_right";
					} else if (
						document.getElementById("middle_right").innerHTML === "X" &&
						document.getElementById("top_right").innerHTML === ""
					) {
						choice = "top_right";
						// CHECKING FOR DIAGONAL WINS
					} else if (
						document.getElementById("middle_center").innerHTML === "X" &&
						document.getElementById("top_left").innerHTML === ""
					) {
						choice = "top_left";
					} else if (
						document.getElementById("top_left").innerHTML === "X" &&
						document.getElementById("middle_center").innerHTML === ""
					) {
						choice = "middle_center";
					} else {
						while (document.getElementById(choice).innerHTML != "") {
							choice = ticTacDict[Math.floor(Math.random() * 9)].squareName;
						}
					}
					break;
			}
		}

		document.getElementById(choice).innerHTML = "O";
		turnCounter++;
		lastAIChoice = choice;
		checkForGameOver(choice, aiPlayer);
		if (turnCounter >= 9 && isGameOver === false) {
			gameOver("tie");
		}
	}
};

checkForGameOver = function(square, player) {
	// At least 5 turns must have occured before a win can occur
	if (turnCounter > 4 && isGameOver === false) {
		switch (square) {
			// Use last box clicked to check for wins
			case "top_left":
				// Find which row has won
				// Top row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML
				) {
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("top_right").style.backgroundColor = "red";
					gameOver(player);
					// Left column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML
				) {
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("bottom_left").style.backgroundColor = "red";
					gameOver(player);
					// Forward slash diagonal
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "top_center":
				// Find which row has won
				// Top row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("top_right").style.backgroundColor = "red";
					gameOver(player);
					// Middle column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_center").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					gameOver(player);
				}
				break;
			case "top_right":
				// Find which row has won
				// Top row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("top_right").style.backgroundColor = "red";
					gameOver(player);
					// Right column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_right").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					document.getElementById("top_right").style.backgroundColor = "red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Back slash diagonal
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_right").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_left").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "middle_left":
				// Find which row has won
				// Middle row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					gameOver(player);
					// Left column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("bottom_left").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "middle_center":
				// Find which row has won
				// Middle row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					gameOver(player);
					// Forward slash diagonal
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Middle column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_center").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					gameOver(player);
					// Back slash
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML
				) {
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("top_right").style.backgroundColor = "red";
					document.getElementById("bottom_left").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "middle_right":
				// Find which row has won
				// Middle row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					gameOver(player);
					// Right column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_right").style.backgroundColor = "red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "bottom_left":
				// Find which row has won
				// Bottom row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("bottom_left").style.backgroundColor = "red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Left column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML
				) {
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("middle_left").style.backgroundColor = "red";
					document.getElementById("bottom_left").style.backgroundColor = "red";
					gameOver(player);
					// Forward slash diagonal
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("bottom_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("top_right").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
			case "bottom_center":
				// Find which row has won
				// Bottom row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_right").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("bottom_left").style.backgroundColor = "red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Middle column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_center").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_center").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					gameOver(player);
				}
				break;
			case "bottom_right":
				// Find which row has won
				// Bottom row
				if (
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("bottom_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("bottom_left").style.backgroundColor = "red";
					document.getElementById("bottom_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Right column
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_right").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_right").innerHTML
				) {
					document.getElementById("top_right").style.backgroundColor = "red";
					document.getElementById("middle_right").style.backgroundColor = "red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
					// Forward slash diagonal
				} else if (
					document.getElementById(square).innerHTML ===
						document.getElementById("middle_center").innerHTML &&
					document.getElementById(square).innerHTML ===
						document.getElementById("top_left").innerHTML
				) {
					// Highlight winning boxes with red
					document.getElementById("top_left").style.backgroundColor = "red";
					document.getElementById("middle_center").style.backgroundColor =
						"red";
					document.getElementById("bottom_right").style.backgroundColor = "red";
					gameOver(player);
				}
				break;
		}
	}
};
