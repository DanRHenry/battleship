const nameInputSection = document.getElementById("nameInputSection");
const id = Math.random();
let enemyPlayStatus = false;
let playerOrder;
let readyToPlay = false;
let boat;
let removeGameSquareFunctionality = false;
let playerName = `playerID:${id}`;
const boatObject = {
  Carrier: "ccccc",
  Battleship: "bbbb",
  Cruiser: "rrr",
  Submarine: "sss",
  Destroyer: "dd",
};
let boatPositions = {};
let enemyBoatPositions = {};
let enemyCoordinates = [];
const sunkBoats = [];

const ws = new WebSocket("ws://127.0.0.1:3400");
ws.addEventListener("open", () => {
  console.log("socket open");
});

ws.addEventListener("close", () => {
  console.log("websocket closed");
  //   const ws = new WebSocket("ws://127.0.0.1:3400");
});

ws.addEventListener("message", (message) => {
  if (message.data === "Welcome new client") {
    return;
  }
  if (JSON.parse(message.data).id === id) {
    // console.log(id);
    return;
  } else if (JSON.parse(message.data).playerOrder) {
    playerOrder = JSON.parse(message.data).playerOrder;
    if (playerOrder === true) {
          document.getElementById(
      `playerTurn`
    ).textContent = `${playerName}, take your turn`;
    } else if (playerOrder === false) {
      document.getElementById(
        `playerTurn`
      ).textContent = `${JSON.parse(message.data).enemyName}, has a turn`;
    }

  } else if (JSON.parse(message.data).boatPositions) {
    enemyBoatPositions = JSON.parse(message.data).boatPositions;
    createEnemyGrid(enemyBoatPositions);
    enemyCoordinates = JSON.parse(message.data).boatPositions;
  } else if (JSON.parse(message.data).playStatus) {
    enemyPlayStatus = JSON.parse(message.data).playStatus;
  } else if (JSON.parse(message.data).hit) {
    const hit = JSON.parse(message.data).hit;
    // console.log(`hit:`,hit)
    document.getElementById(
      `grid-item-${hit[hit.length - 3]}_${hit[hit.length - 1]}`
    ).style.backgroundColor = `red`;
    playerOrder = true;
    ws.send(JSON.stringify({ playerOrder: !playerOrder, id: id , enemyName: playerName}));
    // console.log(`playerOrder:`, playerOrder);
  } else if (JSON.parse(message.data).playerOrder) {
    playerOrder = JSON.parse(message.data).playerOrder;
  } else if (JSON.parse(message.data).endGame) {
    //todo -- change these console logs to on screen messages
    console.log(JSON.parse(message.data).sunkenBoat, "has sunk");
    console.log(
      "the game is ended,",
      JSON.parse(message.data).endGame,
      "has won!"
    );
  } else if (
    JSON.parse(message.data).sunkenBoat &&
    !JSON.parse(message.data).endGame
  ) {
    console.log(JSON.parse(message.data).sunkenBoat, "has sunk");
  }
});

for (element of Object.keys(boatObject)) {
  let localboat = document.createElement("div");
  localboat.textContent = element;
  localboat.id = element;
  localboat.className = `boat ${boatObject[element]}`;
  localboat.style.color = "black";
  localboat.style.userSelect = "none";
  document.getElementById("boatList").appendChild(localboat);
}

let boats = document.getElementsByClassName("boat");

for (let i = 0; i < boats.length; i++) {
  function handleBoatsListClicks() {
    boat = boatObject[boats[i].id];
    const boatName = boats[i];
    if (boatName.style.color !== "white" || boatName.style.color !== "yellow") {
      boatName.style.color = "white";
    } else {
      boatName.style.color = "black";
    }

    for (item of boats) {
      if (item.style.color !== "brown") {
        if (item.id !== boats[i].id) {
          item.style.color = "black";
        }
      }
    }
  }
  function handleBoatsListMouseover() {
    const boatName = boats[i];
    if (boatName.style.color === "brown") {
      boatName.removeEventListener("click", handleBoatsListClicks);
      return;
    }

    boats[i].addEventListener("click", handleBoatsListClicks);
    try {
      if (boatName.style.color === "black") {
        boatName.style.color = "yellow";
      } else if (boatName.style.color === "yellow") {
        boatName.style.color = "black";
      }
    } catch {
      return;
    }

    for (item of boats) {
      if (item.style.color !== "brown") {
        if (boatName.style.color === "white") {
          return;
        } else if (item.id !== boatName.id && item.style.color !== "white") {
          item.style.color = "black";
        }
      }
    }
  }

  boats[i].addEventListener("mouseover", handleBoatsListMouseover);
}

let horizontal = true;
let vertical = false;

const nameInputSectionHTML = `<h2>Enter your name</h2>
    <form action="">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" value="" required="true"><br><br>
        <input type="submit" value="Submit" id="nameSubmitBtn">
      </form>`;

nameInputSection.innerHTML = nameInputSectionHTML;
const nameSubmitBtn = document.getElementById("nameSubmitBtn");

function handleNameSubmitBtnClicked(e) {
  e.preventDefault();
  playerName = document.getElementById("name").value;
  nameInputSection.innerHTML = `<h2>Welcome, ${playerName}!</h2>
  <h3>Place your ships!</h3>`;
  console.log("playerName:", playerName);
  document.getElementById(`gameContainer`).style.display = `flex`;
}

nameSubmitBtn?.addEventListener("click", handleNameSubmitBtnClicked);

const gameBoard = document.getElementById("gameBoard");

function createGrid() {
  const grid = document.createElement("div");
  grid.id = "playerGrid";

  gameBoard.appendChild(grid);

  for (let row = 0; row < 10; row++) {
    for (let column = 0; column < 10; column++) {
      let square = document.createElement("div");
      const identifier = `grid-item-${column}_${row}`;
      square.id = identifier;
      square.className = "gameSquare";

      function handleMouseover() {
        let initialRow = square.id[square.id.length - 3];
        let initialCol = square.id[square.id.length - 1];

        if (boat?.length > 0) {
          let squares = document.getElementsByClassName("gameSquare");
          for (box of squares) {
            if (box.style.color !== "blue") {
              box.style.backgroundColor = "black";
            }
          }
          for (let i = 0; i < boat.length; i++) {
            if (vertical) {
              let position = `grid-item-${initialRow}_${+initialCol + i}`;

              let endPosition = +initialCol + boat.length;

              if (endPosition <= 10) {
                const location = document.getElementById(position);
                if (location.style.color !== "blue") {
                  location.style.backgroundColor = "red";
                } else if (location.style.backgroundColor === "white") {
                  return;
                }
              } else if (endPosition > 10) {
                const location = document.getElementById(position);
                try {
                  if (location.style.backgroundColor !== "white") {
                    location.style.backgroundColor = "gray";
                  }
                } catch {
                  return;
                }
              }
            }

            if (horizontal) {
              let position = `grid-item-${+initialRow + i}_${initialCol}`;

              let endPosition = +initialRow + boat.length;

              if (endPosition <= 10) {
                const location = document.getElementById(position);
                if (location.style.color !== "blue") {
                  location.style.backgroundColor = "green";
                } else if (location.style.backgroundColor === "white") {
                  return;
                }
              } else if (endPosition > 10) {
                const location = document.getElementById(position);
                try {
                  if (location.style.backgroundColor !== "white") {
                    location.style.backgroundColor = "gray";
                  }
                } catch {
                  return;
                }
              }
            }
          }
        }
      }

      function checkPositionsValidity(initialRow, initialCol) {
        let mayPlace = "";
        if (boat) {
          for (let i = 0; i < boat.length; i++) {
            if (vertical) {
              let position = `grid-item-${initialRow}_${+initialCol + i}`;
              if (
                document.getElementById(position)?.style.backgroundColor !==
                "white"
              ) {
                mayPlace += "x";
                if (mayPlace.length === boat.length) {
                  return true;
                }
              }
            }
            if (horizontal) {
              let position = `grid-item-${+initialRow + i}_${initialCol}`;
              if (
                document.getElementById(position)?.style.backgroundColor !==
                "white"
              ) {
                mayPlace += "x";
                if (mayPlace.length === boat.length) {
                  return true;
                }
              }
            }
          }
        } else if (mayPlace.length !== boat.length) {
          return false;
        } else {
          return;
        }
      }

      function handleRightClickedSquare(e) {
        e.preventDefault();
        if (removeGameSquareFunctionality === true) {
          for (square of document.getElementsByClassName("gameSquare")) {
            square.removeEventListener(
              "contextmenu",
              handleRightClickedSquare,
              false
            );
            return;
          }
        }

        let initialRow = square.id[square.id.length - 3];
        let initialCol = square.id[square.id.length - 1];

        if (boat?.length > 0) {
          for (pos of Object.keys(boatObject)) {
            if (boat === boatObject[pos]) {
              boatPositions[pos] = [];
              // console.log(boat)

              if (vertical) {
                if (checkPositionsValidity(initialRow, initialCol) === true) {
                  for (let i = 0; i < boat.length; i++) {
                    let position = `grid-item-${initialRow}_${+initialCol + i}`;

                    try {
                      boatPositions[pos].push(+initialRow);
                      boatPositions[pos].push(+initialCol + i);

                      document.getElementById(position).style
                        .backgroundColor === "white";
                      let endPosition = +initialCol + boat.length;
                      if (endPosition <= 10) {
                        document.getElementById(
                          position
                        ).style.backgroundColor = "white";
                        document.getElementById(position).style.color = "blue";
                      }
                    } catch {
                      return;
                    }
                  }
                  for (item of boats) {
                    if (item.className.split([" "])[1] === boat) {
                      item.style.color = "brown";
                    }
                  }
                }
              }

              if (horizontal) {
                if (checkPositionsValidity(initialRow, initialCol) === true) {
                  for (let i = 0; i < boat.length; i++) {
                    let position = `grid-item-${+initialRow + i}_${initialCol}`;
                    try {
                      boatPositions[pos].push(+initialRow + i);
                      boatPositions[pos].push(+initialCol);

                      document.getElementById(position).style
                        .backgroundColor === "white";
                      let endPosition = +initialRow + boat.length;
                      if (endPosition <= 10) {
                        document.getElementById(
                          position
                        ).style.backgroundColor = "white";
                        document.getElementById(position).style.color = "blue";
                      }
                    } catch {
                      return;
                    }
                  }
                  for (item of boats) {
                    if (item.className.split([" "])[1] === boat) {
                      item.style.color = "brown";
                    }
                  }
                  boat = "";
                }
              }
              for (square of document.getElementsByClassName("gameSquare")) {
                if (square.style.backgroundColor === `green` || square.style.backgroundColor === `red`) {
                  square.style.backgroundColor = `black`;
                }
              }
            }
          }
        }

        let counter = 0;
        for (item of boats) {
          try {
            if (item.style.color === "brown") {
              counter++;
            }
          } catch {
            return;
          }
        }

        if (counter === 1) {
          removeGameSquareFunctionality = true;
          const boatData = { boatPositions: boatPositions, id: id };
          const ws = new WebSocket("ws://127.0.0.1:3400");
          ws.addEventListener("open", () => {
            ws.send(JSON.stringify(boatData));
            ws.send(JSON.stringify({ playStatus: true, id: id }));
            ws.close();
          });
          readyToPlay = true;
          if (enemyPlayStatus === false) {
            determinePlayerOrder();
          } else if (enemyPlayStatus === true && readyToPlay === true) {
            createEnemyGrid(enemyBoatPositions);
          }
        }
        boat = "";
      }

      square.addEventListener("mouseover", handleMouseover);

      square.addEventListener("click", () => {
        vertical = !vertical;
        horizontal = !horizontal;
        handleMouseover();
      });

      square.addEventListener("contextmenu", handleRightClickedSquare, false);
      document.getElementById(`placeShip`).addEventListener(`click`, handleRightClickedSquare, false)
      grid.append(square);
    }
  }
}

createGrid();

function startGame() {
  console.log("the game has begun");
}

function createEnemyGrid(boatPositions) {
  if (!enemyPlayStatus || !readyToPlay) {
    ws.addEventListener("message", (message) => {
      if (
        JSON.parse(message.data).playStatus &&
        JSON.parse(message.data).id !== id
      ) {
        enemyPlayStatus = JSON.parse(message.data).playStatus;
        createEnemyGrid(boatPositions);
      }
    });
    return;
  }

  const enemyGrid = document.createElement("div");

  enemyGrid.id = "enemyGrid";

  document.getElementById("enemyBoard").appendChild(enemyGrid);

  for (let row = 0; row < 10; row++) {
    for (let column = 0; column < 10; column++) {
      let square = document.createElement("div");
      const identifier = `enemy-grid-item-${column}_${row}`;
      square.id = identifier;
      square.className = "enemyGameSquare";

      function handleClick() {
        if (playerOrder === true) {
          playerOrder = false;
          console.log(`playerOrder:`, playerOrder);
          document.getElementById(`playerTurn`).textContent = ``;
          square.style.backgroundColor = "red";
          const ws = new WebSocket(`ws://127.0.0.1:3400`);
          ws.addEventListener(`open`, () => {
            ws.send(JSON.stringify({ hit: square.id, id: id }));
            ws.close();
          });
          const clickedColumn = square.id[square.id.length - 3];
          const clickedRow = square.id[square.id.length - 1];
          const location = clickedColumn + clickedRow;

          //! if the number of the iteration matches the length of the boatPositions object value, log a sink

          //! Check the incoming enemy boatPositions object (to array)
          for (item of Object.keys(boatPositions)) {
            for (let i = 0; i < boatPositions[item].length; i += 2) {
              //! check is the coordinate pair from the boatPositions object
              let check =
                boatPositions[item][i].toString() +
                boatPositions[item][i + 1].toString();

              //! location is the spot clicked
              //! if the location matches one of the coordinate pairs from the enemy boatPositions Object (if location === check)...
              if (location === check) {
                //! change the clicked location backgroundColor to orange
                square.style.backgroundColor = "orange";

                //! for each position of the boatPositions object...
                let counter = 0;
                let currentBoat = boatPositions[item];
                const enemyGameSquare =
                  document.getElementsByClassName("enemyGameSquare");

                //!iterate over the enemyGameSquare array
                for (let sq = 0; sq < enemyGameSquare.length; sq++) {
                  if (enemyGameSquare[sq].style.backgroundColor === "orange") {
                    for (let i = 0; i < currentBoat.length; i += 2) {
                      let c = currentBoat[i].toString();
                      let r = currentBoat[i + 1].toString();
                      let check = c + r;

                      let col =
                        enemyGameSquare[sq].id[
                          enemyGameSquare[sq].id.length - 3
                        ].toString();
                      let row =
                        enemyGameSquare[sq].id[
                          enemyGameSquare[sq].id.length - 1
                        ].toString();
                      let esCheck = col + row;
                      if (check === esCheck) {
                        counter++;
                      }

                      const ws = new WebSocket("ws://127.0.0.1:3400");
                      ws.addEventListener("open", () => {
                        if (
                          counter === currentBoat.length / 2 &&
                          !sunkBoats.includes(item)
                        ) {
                          console.log(item, "sunk");
                          sunkBoats.push(item);

                          //todo if the length is 5, end the game
                          if (sunkBoats.length === 2) {
                            ws.send(
                              JSON.stringify({
                                sunkenBoat: item,
                                endGame: playerName,
                              })
                            );
                            //todo if not send the sunken boat, and end the turn
                          } else {
                            ws.send(JSON.stringify({ sunkenBoat: item }));
                          }
                        }
                        ws.close();
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }

      square.addEventListener("click", handleClick);
      square.addEventListener(`touchstart`, handleClick);
      enemyGrid.append(square);
    }
  }
}

function determinePlayerOrder() {
  const ws = new WebSocket("ws://127.0.0.1:3400");
  ws.addEventListener("open", () => {
    const numb = Math.floor(Math.random(10) * 100);
    if (numb % 2 === 0) {
      playerOrder = true;
      ws.send(JSON.stringify({ playerOrder: !playerOrder, id: id , enemyName: playerName}));
    } else {
      playerOrder = false;
      const playerorderobject = JSON.stringify({
        playerOrder: !playerOrder,
        id: id,
      });
      ws.send(playerorderobject);
    }
    ws.close();
  });
}

//todo -- if colors are gray and the game hasn't begun yet, maybe allow for ships to be recalled. this could be accomplished by searching the grid for the matching id
//todo -- rework graphic layout
//todo -- add a notice of the game ending, ships sunk, etc to the layout
//todo -- fix player turn message
//todo -- add logic to deal with more than two players (maybe lock out new players at a point?)
//todo -- add a loop to keep trying to send gameplay information if the other player joins late?
//todo -- continue working on touch integration solutions