import React, { useEffect, useState } from "react";
import Blank from "./blank.png";
import Snake from "./snake.png";
import Food from "./food.png";
import { useRef } from "react";

function Board() {
    const width = 10;
    const height = 10;
    const [score, setScore] = useState(0);
    let initialRows = [];
    for (let i = 0; i < height; i++) {
        initialRows.push([]);
        for (let k = 0; k < width; k++) {
            initialRows[i].push("blank");
        }
    }
    const [rows, setRows] = useState(initialRows);
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [direction, setDirection] = useState("bottom");
    const displayRows = rows.map((row) => (
        <li style={{ listStyleType: "none" }}>
            {row.map((e) => {
                switch (e) {
                    case "blank":
                        return <img src={Blank} />;
                    case "snake":
                        return <img src={Snake} />;
                    case "food":
                        return <img src={Food} />;
                }
            })}
        </li>
    ));
    const displaySnake = () => {
        const newRows = initialRows;
        snake.forEach((cell) => {
            newRows[cell.x][cell.y] = "snake";
        });
        newRows[food.x][food.y] = "food";
        setRows(newRows);
    };
    
    
    function useIntervel(callback, delay) {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }
    const changeDirectionWithKeys = (e) => {
        var { keyCode } = e;
        switch (keyCode) {
            case 37:
                setDirection("left");
                break;
            case 38:
                setDirection("top");
                break;
            case 39:
                setDirection("right");
                break;
            case 40:
                setDirection("bottom");
                break;
            default:
                break;
        }
    };
    document.addEventListener("keydown", changeDirectionWithKeys, false);
    const randomPosition = () => {
        const position = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
        };
        return position;
    };
    const [food, setFood] = useState(randomPosition);
    const [start, setStart] = useState(true);
    const moveSnake = () => {
        const newSnake = [];
        switch (direction) {
            case "right":
                if (snake[0].y + 1 > 9) {
                    setStart(false);
                }
                    newSnake.push({ x: snake[0].x, y: (snake[0].y + 1)%width });
                break;
            case "left":
                if (snake[0].y - 1 < 0) {
                    setStart(false);
                }
                newSnake.push({ x: snake[0].x, y: (snake[0].y - 1 + width) % width });
                break;
            case "top":
                if (snake[0].x - 1 < 0) {
                    setStart(false);
                }
                newSnake.push({ x: (snake[0].x - 1 + height) % height, y: snake[0].y });
                break;
            case "bottom":
                if (snake[0].x + 1 > 9) {
                    setStart(false);
                }
                newSnake.push({ x: (snake[0].x + 1) % height, y: snake[0].y });
        }
        if (start) {
            snake.forEach((cell) => {
                newSnake.push(cell);
            });
            if (snake[0].x === food.x && snake[0].y === food.y) {
                setFood(randomPosition);
                setScore(score + 1)
            } else {
                newSnake.pop();
            }
            setSnake(newSnake);
            displaySnake();
        }
        
    };
    useIntervel(moveSnake, 350);
    const snakeReset = () => {
        for (let i = 0; i < score; i++){
            snake.pop()
        }
        setScore(0);
        setStart(true);

    }
    return (
        <div>
            { <div>
                {displayRows}
                <label>Score:{score}</label>
            </div>
            }
            {!start && <div style={{  background: "red", width: "600px", marginLeft: "480px", height: "150px", textAlign: "center" ,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <label style={{ fontSize: "50px", color: "white" }}>Game Over</label>
                <button style={{ width: "150px", height: "40px", fontSize: "17px", borderRadius: "5px", cursor: "pointer" }} onClick={() => { snakeReset()}}>Restart</button>
            </div>}
        </div>
    )
}

export default Board;
