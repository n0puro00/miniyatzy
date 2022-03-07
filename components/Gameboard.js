import React, { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style';

let board = [];
let valueOfDice = []
let sumOfDice = [0, 0, 0, 0, 0, 0];

const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;

let ifGetBonus = false;

export default function Gameboard() {
    const [status, setStatus] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [possibleBonus, setPossibleBonus] = useState('');
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedNumber, setSelectedNumber] = useState(new Array(6).fill(false));
    const [total, setTotal] = useState(0);
    const [bonus, setBonus] = useState(63);
    const [button, setButton] = useState('Throw dices')



    function start() {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus('Game has not started');
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setSelectedNumber(new Array(6).fill(false));
        setTotal(0);
        setBonus(63);
        setButton('Throw dices');
        sumOfDice = [0, 0 , 0, 0, 0, 0];
        ifGetBonus = false;
    }

    function throwDices () {
        if (button === "New game") {
            start()
        }

        else if (nbrOfThrowsLeft === 0) {
            setStatus("Select your points!")
        }

        else {
            for (let i = 0; i < NBR_OF_DICES; i++) {
                if (!selectedDices[i]) {
                    let randomNumber = Math.floor(Math.random()* 6 + 1);
                    board[i] = 'dice-' + randomNumber;
                    valueOfDice[i] = randomNumber;
                }
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft -1);
        }
    }

    function selectDices(i) {
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus("You have to throw first")
        }
        
        else {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
    }

    function selectNumber(n) {
        if (nbrOfThrowsLeft > 0) {
            setStatus("Throw 3 times!")
        }

        else if (!selectedNumber[n]) {
            let number = [...selectedNumber];
            number[n] = true;
            setSelectedNumber(number);
            setSelectedDices(new Array(NBR_OF_DICES).fill(false));
            
            let Sum = 0;
            for (let i = 0; i < 6; i++) {
                if (n === valueOfDice[i]) {
                    Sum += valueOfDice[i];
                }
            }
            sumOfDice[n - 1] = Sum;
            setTotal(total + Sum);
            setNbrOfThrowsLeft(3);
            setBonus(bonus - Sum);
            getBonus();
        }

        else {
            setStatus("You have already selected points for "+[n])
        }
    }

    function getBonus() {
        if (bonus > 0) {
            setPossibleBonus('You need '+ bonus +' more points to qualify for the bonus.')
        }

        else if (bonus <= 0) {
            setPossibleBonus('You got the bonus.')
            ifGetBonus = true;

        }
    }

    function getNumberColor(n) {
        return selectedNumber[n]? "black" : "blue"; 
    }

    function getDiceColor(i) {
        return selectedDices[i]? "black" : "blue" ;  
    }

    function winner() {
        if (nbrOfThrowsLeft === 0) {
            setStatus('Select points');
        }

        else {
            setStatus('Select and throw dices');
        }
    }

    useEffect( () => {
        winner();
        getBonus();

        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus('Throw dices');
        }
        if (nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS -1);
        }
        if (selectedNumber[1] === true && selectedNumber[2] === true && selectedNumber[3] === true && selectedNumber[4] === true && selectedNumber[5] === true && selectedNumber[6] === true){
            setStatus('Game over');
            setButton('New game');
    }
}, [nbrOfThrowsLeft, selectedNumber, button]);


    const row = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        row.push(
            <Pressable
                key={"row" + i}
                onPress={()=> selectDices(i) }>
                <MaterialCommunityIcons
                    name={board[i]}
                    key={"row"+i}
                    size={55}
                    color={getDiceColor(i)}>
             </MaterialCommunityIcons>
            </Pressable>
        );
    }

    const numbers = [];
    for (let n = 1; n < 7; n++) {
        numbers.push(
            <View key={"key" + n}>
                <Text style={styles.sums}>{sumOfDice[n - 1]}</Text>
                <Pressable
                    key={"numbers" + n}
                    onPress={() => selectNumber(n)}>
                    <MaterialCommunityIcons
                        name={"numeric-" + n + "-circle"}
                        key={"numbers" + n}
                        size={40}
                        color={getNumberColor(n)}
                        style={styles.numbers}>
                    </MaterialCommunityIcons>
                </Pressable>
            </View>
        );
    }

    return(
        <View style={styles.gameboard}>
            <View style={styles.flex}>{row}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable style={styles.button}
                onPress={() => throwDices()}>
                    <Text style={styles.buttonText}>
                        {button}
                    </Text>
            </Pressable>
            <Text style={styles.points}>Total: {ifGetBonus ? total + 50 : total}</Text>
            <Text style={styles.bonus}> {possibleBonus}</Text>
            <View style={styles.gameboard}>
            <View style={styles.flex}>{numbers}</View>
            </View>
        </View>
    )
}