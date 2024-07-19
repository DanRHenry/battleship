const nameInputSection = document.getElementById("nameInputSection");

let enemyBoard = "";
let playerName = "";

const ws = new WebSocket("ws://127.0.0.1:3400");
// ws.addEventListener("open", () => {
//   console.log("socket open");
// });

ws.addEventListener("close", () => {
  const ws = new WebSocket("ws://127.0.0.1:3400");
  ws.addEventListener("open", () => {
    console.log("socket reopened");
  });
});

ws.addEventListener("message", (message) => {
  if (message.data === "Welcome new client") {
    return;
  }

  if (JSON.parse(message.data).enemyCoordinates) {
    const coordinateData = JSON.parse(message.data).enemyCoordinates;

    const col = coordinateData[coordinateData.length - 3];
    const row = coordinateData[coordinateData.length - 1];

    enemyBoard += col;
    enemyBoard += row;
  }
});

const boatObject = {
  Carrier: "ccccc",
  Battleship: "bbbb",
  Cruiser: "rrr",
  Submarine: "sss",
  Destroyer: "dd",
};

let boat;

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
      if (item.id !== boats[i].id) {
        item.style.color = "black";
      }
    }
  }
  function handleBoatsListMouseover() {
    const boatName = boats[i];

    if (boatName.style.color === "black") {
      boatName.style.color = "yellow";
    } else if (boatName.style.color === "yellow") {
      boatName.style.color = "black";
    }
    for (item of boats) {
      if (boatName.style.color === "white") {
        return;
      } else if (item.id !== boatName.id && item.style.color !== "white") {
        item.style.color = "black";
      }
    }
  }

  boats[i].addEventListener("click", handleBoatsListClicks);
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
}

nameSubmitBtn?.addEventListener("click", handleNameSubmitBtnClicked);

const gameBoard = document.getElementById("gameBoard");

const grid = document.createElement("div");

grid.style.display = "grid";
grid.style.gridTemplateColumns = "repeat(10,1fr)";
grid.style.gridTemplateRows = "repeat(10,1fr)";
grid.style.width = "20em";
grid.style.gap = ".25em";

gameBoard.appendChild(grid);

for (let row = 0; row < 10; row++) {
  for (let column = 0; column < 10; column++) {
    const square = document.createElement("div");
    square.style.backgroundColor = "black";
    square.style.color = "white";
    square.style.height = "2em";
    square.style.width = "2em";
    const identifier = `grid-item-${column}_${row}`;
    square.id = identifier;
    square.className = "gameSquare";
    square.textContent = ` ${column}-${row} `;

    function handleMouseover() {
      let initialRow = square.id[square.id.length - 3];
      let initialCol = square.id[square.id.length - 1];

      if (boat?.length > 0) {
        let squares = document.getElementsByClassName("gameSquare");
        for (box of squares) {
          if (box.style.color !== "blue") {
            box.style.backgroundColor = "black";
          }
          for (boatName of Object.keys(boatObject)) {
            // console.log("box.className",box.className)
            console.log("box.id",box.id)
            console.log(boatName)

            if (box.className === boatName) {
              console.log("here")
            }
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
                if (location.style.backgroundColor !== 'white') {
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
                  if (location.style.backgroundColor !== 'white') {
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
      if (boat) {
        let mayPlace = "";
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
      let initialRow = square.id[square.id.length - 3];
      let initialCol = square.id[square.id.length - 1];

      if (boat?.length > 0) {

        function sendShipData(coordinates) {
          const id = document.getElementById(coordinates).id;
          const ws = new WebSocket("ws://127.0.0.1:3400");
          ws.addEventListener("open", () => {
            ws.send(JSON.stringify({ enemyCoordinates: id }));
          });
        }

        if (vertical) {
          if (checkPositionsValidity(initialRow, initialCol) === true) {
            for (let i = 0; i < boat.length; i++) {
              let position = `grid-item-${initialRow}_${+initialCol + i}`;

              document.getElementById(position).style.backgroundColor ===
                "white";
              let endPosition = +initialCol + boat.length;
              if (endPosition <= 10) {
                document.getElementById(position).style.backgroundColor =
                  "white";
                document.getElementById(position).style.color = "blue";
                sendShipData(position);
              }
            }
          }
        }

        if (horizontal) {
          if (checkPositionsValidity(initialRow, initialCol) === true) {
            for (let i = 0; i < boat.length; i++) {
              let position = `grid-item-${+initialRow + i}_${initialCol}`;

              document.getElementById(position).style.backgroundColor ===
                "white";
              let endPosition = +initialRow + boat.length;
              if (endPosition <= 10) {
                document.getElementById(position).style.backgroundColor =
                  "white";

                document.getElementById(position).style.color = "blue";
                sendShipData(position);
              }
            }
          }
        }
      }
    }

    square.addEventListener("mouseover", handleMouseover);

    square.addEventListener("click", () => {
      vertical = !vertical;
      horizontal = !horizontal;
      handleMouseover();
    });

    square.addEventListener("contextmenu", handleRightClickedSquare, false);
    grid.append(square);
  }
}

//todo -- once placed, ship colors should turn from white to gray
//todo -- if colors are gray and the game hasn't begun yet, maybe allow for ships to be recalled. this could be accomplished by searching the grid for the matching id
//todo -- fix overlaps when placing ships
//todo -- work on websocket integration, player turns, etc.
//todo -- use the enemyBoard string to determine hits
