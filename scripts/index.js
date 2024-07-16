const nameSubmitBtn = document.getElementById("nameSubmitBtn");

const nameInputSection = document.getElementById("nameInputSection");

//Temporary for testing
const boatObject = {
  Carrier: "xxxxx",
  Battleship: "xxxx",
  Cruiser: "xxx",
  Submarine: "xxx",
  Destroyer: "xx",
};

let boat;
// let boat = "xxxx";

for (element of Object.keys(boatObject)) {
  let localboat = document.createElement("div");
  localboat.textContent = element;
  localboat.id = element;
  localboat.className = "boat";
  localboat.style.color = "black";
  localboat.style.userSelect = "none";
  document.getElementById("boatList").appendChild(localboat);
}

let boats = document.getElementsByClassName("boat");

for (let i = 0; i < boats.length; i++) {
  function handleBoatsListClicks() {
    boat = boatObject[boats[i].id];
    if (boats[i].style.color == "black") {
      boats[i].style.color = "white";
    } else {
      boats[i].style.color = "black";
    }

    for (item of boats) {
      if (item.id !== boats[i].id) {
        item.style.color = "black";
      }
    }
  }

  boats[i].addEventListener("click", handleBoatsListClicks);
}

// let boat = "0000"; // change this to whichever boat has been clicked (for placement) -- use an object with each boat name as keys and length as values
let horizontal = true;
let vertical = false;

//End Temporary for testing

const nameInputSectionHTML = `<h2>Enter your name</h2>
    <form action="">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name" value="" required="true"><br><br>
        <input type="submit" value="Submit" id="nameSubmitBtn">
      </form>`;

nameInputSection.innerHTML = nameInputSectionHTML;
function handleNameSubmitBtnClicked(e) {
  // e.preventDefault()
  nameInputSection.innerHTML = "";
  // alert("done")
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

    function handleClickedSquare() {
      // console.log("here")
      if (boat?.length > 0) {
        let squares = document.getElementsByClassName("gameSquare");
        for (box of squares) {
          if (box.style.color !== "blue") {
            box.style.backgroundColor = "black";
          }
        }

        // use this section for initial placement and switching between horizontal and vertical alignment, but have a separate submit button for confirmation

        //use a separate event listener to detect hovering to show boat temp positions

        for (let i = 0; i < boat.length; i++) {
          if (vertical) {
            let initialRow = square.id[square.id.length - 3];

            let initialCol = square.id[square.id.length - 1];

            let temp = `grid-item-${initialRow}_${+initialCol + i}`;

            let endPosition = +initialCol + boat.length;
            if (endPosition < 11) {
              if (document.getElementById(temp).style.color !== "blue") {
                document.getElementById(temp).style.backgroundColor = "red";
              }
            } else {
              // console.log("won't fit");
              if (document.getElementById(temp)) {
                document.getElementById(temp).style.backgroundColor = "gray";
              }
            }
          }

          if (horizontal) {
            let initialRow = +square.id[square.id.length - 3];
            let initialCol = +square.id[square.id.length - 1];

            let temp = `grid-item-${initialRow + i}_${initialCol}`;

            let endPosition = +initialRow + boat.length;

            if (endPosition < 11) {
              if (document.getElementById(temp).style.color !== "blue") {
                document.getElementById(temp).style.backgroundColor = "green";
              }
            } else {
              //   console.log("won't fit");
              if (document.getElementById(temp)) {
                document.getElementById(temp).style.backgroundColor = "gray";
              }
            }
          }
        }
      } else {
        square.removeEventListener("click", handleClickedSquare);
      }
    }

    function checkPositionsValidity(initialRow, initialCol) {
      let positionsToCheck = "";
      for (let i = 0; i < boat.length; i++) {
        if (vertical) {
          let temp = `grid-item-${initialRow}_${+initialCol + i}`;
          if (document.getElementById(temp).style.backgroundColor === "white") {
            return;
          } else {
            positionsToCheck += "x";
          }
        }
        if (horizontal) {
          let temp = `grid-item-${initialRow + i}_${initialCol}`;
          if (document.getElementById(temp).style.backgroundColor === "white") {
            return;
          } else {
            positionsToCheck += "x";
          }
        }
        if (positionsToCheck.length != boat.length) {
          return false;
        }
      }
    }

    function handleDblClickedSquare() {
      if (boat?.length > 0) {
        let squares = document.getElementsByClassName("gameSquare");
        for (box of squares) {
          if (box.style.color !== "blue") {
            box.style.backgroundColor = "black";
          }
        }

        for (let i = 0; i < boat.length; i++) {
          if (vertical) {
            let initialRow = square.id[square.id.length - 3];

            let initialCol = square.id[square.id.length - 1];

            let temp = `grid-item-${initialRow}_${+initialCol + i}`;
            if (
              document.getElementById(temp).style.backgroundColor === "white"
            ) {
              return;
            }
            let endPosition = +initialCol + boat.length;
            if (endPosition < 11) {
              document.getElementById(temp).style.color = "blue";
              document.getElementById(temp).style.backgroundColor = "white";
            } else {
              if (document.getElementById(temp)) {
                document.getElementById(temp).style.backgroundColor = "gray";
              }
            }
          }

          if (horizontal) {
            let initialRow = +square.id[square.id.length - 3];
            let initialCol = +square.id[square.id.length - 1];

            let temp = `grid-item-${initialRow + i}_${initialCol}`;
            if (
              document.getElementById(temp).style.backgroundColor === "white"
            ) {
              return;
            }
            let endPosition = +initialRow + boat.length;

            if (endPosition < 11) {
              document.getElementById(temp).style.color = "blue";
              document.getElementById(temp).style.backgroundColor = "white";
            } else {
              if (document.getElementById(temp)) {
                document.getElementById(temp).style.backgroundColor = "gray";
              }
            }
          }
        }
      } else {
        square.removeEventListener("click", handleClickedSquare);
      }
    }

    square.addEventListener("mouseover", handleClickedSquare);

    square.addEventListener("click", () => {
      vertical = !vertical;
      horizontal = !horizontal;
      handleClickedSquare();
    });

    square.addEventListener("contextmenu", handleDblClickedSquare, false);
    grid.append(square);
  }
}

//todo -- once placed, ship colors should turn from white to gray
//todo -- if colors are gray and the game hasn't begun yet, maybe allow for ships to be recalled. this could be accomplished by searching the grid for the matching id
//todo -- fix overlaps when placing ships
//todo -- work on websocket integration, player turns, etc.