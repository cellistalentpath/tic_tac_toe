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

let turnCounter = 0;
let isGameOver = false;
let p1points = 0;
let p2points = 0;
const gameBoard = new Board();

const playerOne = new Player("Player One", 0); //Will always have Xs
const playerTwo = new Player("Player Two", 0); //Will always have Os

let currentPlayer = playerOne;

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
		document.getElementById("p1points").innerHTML =
			"Player One points: " + p1points;
		document.getElementById("p2points").innerHTML =
			"Player Two points: " + p2points;
	}
	isGameOver = true;
};

myReset = function() {
	turnCounter = 0;
	gameBoard.clear();
	isGameOver = false;
	let test = document.getElementsByClassName("squares");
	// Change all squares back to orange
	for (i = 0; i < test.length; i++) {
		test[i].style.backgroundColor = "orange";
	}
};

fillTheSquare = function(square) {
	if (document.getElementById(square).innerHTML === "") {
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
					// Highlight winning boxes with red
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
