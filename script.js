
//temp function
function JamSlaysIt()
{
    h = getSavedData()
    restoreFrom(h["17/02/2019, 13:31:41"])
}

/* 
TO-DO 


*/


function onBodyLoad()
{
    // alert("A")
//    debugger;
    let a = Date.now();
    generateGrid();

    addRowColumnSectionClasses();

    addBoxesClasses();
    addSectorClasses();
    
    fillValues();
    updateDataClasses();
    $('input').on('focusout', trimInputCellValue);

    getData();

    updateData()

    console.log(Date.now() - a);
}

let defObj = {}
defObj.filledNumbers = [];
defObj.remainingNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// defObj.filledCount = -1;
// defObj.remainingCount = -1;

let alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function generateGrid()
{
    let boxName;
    let boxNumber;
    for (j=0; j<3; j++)
    {
        for (i=0; i<3; i++)
        {
            boxNumber = (j*3)+i;
            boxName = alphabets[boxNumber]
            
            $('body').append(getTableHTML(['box' + boxName, 'box' + String(boxNumber + 1).trim()]));
        }
        $('body').append('<br>')
    }
}

function getTableHTML(param)
{
    let table_HTML = '';
    let table_HTMLstart = '<table ';
    table_HTMLstart += addClasses(param) + '>';
    let table_HTMLbody = '';
    let table_HTMLend = '</table>';
    for (let i=1; i<=3; i++)
    {
        table_HTMLbody += getTRHTML();    
    }
    table_HTML = table_HTMLstart + table_HTMLbody + table_HTMLend;
    return table_HTML;
}

function addClasses(param)
{
    let len = param.length; 
    let retHTML = 'class="'
    for (let i=0; i<len; i++)
    {
        retHTML += param[i] + ' ';
    }
    retHTML += '"'

    return retHTML;
}

function getTRHTML()
{
    let TR_HTML = '';
    let TR_HTMLstart = '<tr>';
    let TR_HTMLbody = '';
    let TR_HTMLend = '</tr>';
    for (let i=1; i<=3; i++)
    {
        TR_HTMLbody += getTDHTML();    
    }
    TR_HTML = TR_HTMLstart + TR_HTMLbody + TR_HTMLend;
    return TR_HTML;
}


function getTDHTML()
{
    let TDHTML = '<td><input class="inputCell" /></td>'
    return TDHTML;
}

function fillValues()
{
    //https://www.sudokukingdom.com/very-easy-sudoku.php
    //run this code on the above site
    /* 
        let a = document.querySelectorAll('.k1')
        let b=[]; 
        for (let i=0; i<a.length; i++)
        {
            b.push(a[i].textContent)
        }
        
        let g = {};
        g.b = b;
        JSON.stringify(g.b);

        copy that to site console



        sector combo data
        {"data":[["A","B","C"],["D","E","F"],["G","H","I"],["A","D","G"],["B","E","H"],["C","F","I"]]}
    */
    
    let g = {};
    if (localStorage.sudoku)
    {
        g = JSON.parse(localStorage.sudoku);
    }
    else
    {
        // default data. change it to last saved information. 
        g = {};
        g.b = ["1","8"," "," ","4"," "," ","3","7"," "," ","7","6","1","8","9"," "," "," ","2","4"," ","5"," ","6"," ","1"," ","5"," ","4"," ","8"," ","7","1"," "," ","1","5","9"," ","8"," ","4","8","4","6"," "," ","3","5"," "," ","7"," "," ","8"," ","3","2"," ","4"," ","8"," ","7","2"," "," ","6","5"," ","6","9"," ","1","5","7"," "," "];

    }
    
    /* let t = document.querySelectorAll('td');
    for (let i = 0; i<g.b.length; i++)
    {
        t[i].children[0].value = g.b[i]

    }  */

    renderData(g.b);

}


function renderData(arrData)
{
    let t = document.querySelectorAll('td');
    for (let i = 0; i<arrData.length; i++)
    {
        t[i].children[0].value = arrData[i]

    } 
}


let sudData = {};
let indexRemainingValues = [];
let dictIndexRemainingValues = [];

function updateDataClasses()
{
    let cells = document.querySelectorAll('td');
    let currCellValue;
    for (let i=0; i<81; i++)
    {
        currCellValue = cells[i].children[0].value;
        AddRemoveDataClasses(cells[i], currCellValue);
    }
}


function AddRemoveDataClasses(elem, value)
{
    let $elem  = $(elem)
    if (value.trim() === "")
    {
        $elem.addClass('Empty');
    }
    else
    {
        $elem.addClass('val' + String(value));
        $elem.addClass('filled');
        $elem.removeClass('Empty');
        $elem.removeClass('PsblVal');
        $elem.removeAttr("possiblevalues");

    }
}


//function initializes the suddata object and the indexRemainingvalues object. 
function getData()
{

    indexRemainingValues = [];
    dictIndexRemainingValues = [];

    sudData.box = {};   

    let tables = $('table');
    let boxName;
    let dictCounter = -1;
    for (let i=0; i<tables.length; i++)
    {
        boxName  = tables[i].classList[0];
        sudData.box[boxName] = JSON.parse(JSON.stringify(defObj));

        indexRemainingValues.push([boxName, 9])
        dictCounter++;
        dictIndexRemainingValues[boxName] = dictCounter;
    }

    sudData.row = {};
    let rowName;
    for (let i=1; i<=9; i++)
    {
        rowName = 'row' + String(i).trim();
        sudData.row[rowName] = JSON.parse(JSON.stringify(defObj));

        indexRemainingValues.push([rowName, 9])
        dictCounter++;
        dictIndexRemainingValues[rowName] = dictCounter;
    }

    sudData.col = {};
    let columnName;
    for (let i=1; i<=9; i++)
    {
        columnName = 'col' + String(i).trim();
        sudData.col[columnName] = JSON.parse(JSON.stringify(defObj));

        indexRemainingValues.push([columnName, 9])
        dictCounter++;
        dictIndexRemainingValues[columnName] = dictCounter;
        
    }
}


let oLeft = [];
let oTop = [];

function addBoxesClasses()
{
    let boxClassName = ''
    for (let i=0; i<9; i++)
    {
        boxClassName = '.box' + alphabets[i] + ' td';
        $(boxClassName).addClass('box' + alphabets[i])
    }
}

function addSectorClasses()
{
    let sectorData = {"data":[["A","B","C"],["D","E","F"],["G","H","I"],["A","D","G"],["B","E","H"],["C","F","I"]]}
    let classNameString1 = '.box';
    let classNameString2 = ' td, ';
    let fullClassString = '';
    let sectorNumber;

    let sectorClasses = [];
    // $('.boxA td, .boxB td, .boxC td')
    for (s in sectorData.data)
    {
        sectorClasses = sectorData.data[s];
        fullClassString = '';
        for (j in sectorClasses)
        {
            fullClassString += classNameString1 + String(sectorClasses[j]).trim() + classNameString2;
        }
        // console.log("before substr", fullClassString)        
        fullClassString = fullClassString.substr(0, fullClassString.length - 2);
        // console.log(s, fullClassString)
        sectorNumber = String(Number(s) + 1).trim();
        $(fullClassString).addClass('sector' + sectorNumber);
    }
}

function addRowColumnSectionClasses()
{
    
    let cells = document.querySelectorAll('td');
    let currCell;
    let currLeft; 
    let currTop; 
    for (let i=0; i<cells.length; i++)
    {
        currCell = $(cells[i]);
        currLeft = currCell.position().left; 
        currTop = currCell.position().top;

        // console.log("i ", i, "left ", currCell.offsetLeft,  "top ", currCell.offsetTop)
        // console.log("i ", i, "left ", currLeft,  "top ", currTop)
        if (oLeft.indexOf(currLeft) === -1)
        {
            oLeft.push(currLeft)
        }

        if (oTop.indexOf(currTop) === -1)
        {
            oTop.push(currTop)
        }
    }


    for (i=0; i<cells.length; i++)
    {
        currCell = $(cells[i]);
        $(currCell).addClass("row" + (oTop.indexOf($(currCell).position().top) +1))
        $(currCell).addClass("col" + (oLeft.indexOf($(currCell).position().left) +1))
    }
}


/* function CheckSingleEmpty()
{
    numEmpty = -1;
    for (let i=0; i<alphabets.length; i++){
        // console.log($('.box' + alphabets[i] + '.Empty').length)   
        numEmpty = $('.box' + alphabets[i] + '.Empty').length;
        if (numEmpty === 1)
        {

        }   
    }
} */


function updateData()
{
    let filledCells = $('.filled');
    for (let i=0; i<filledCells.length; i++)
    {
        getDataFrom(filledCells[i]);
    }
}


function getDataFrom(elem)
{
    // debugger;
    // console.log("fired")
    let filledValue = Number(elem.children[0].value);
    // debugger;
    let classList = elem.classList;
    // console.log(classList)
    let numClasses = classList.length;
    let classNameStart = '';
    let className = '';
    let obj1;
    for (let i=0; i<numClasses; i++)
    {
        className = classList[i];
        classNameStart = className.substr(0, 3);
        
        if (classNameStart === 'box')
        {
            obj1 = sudData.box;
           
        }
        else if (classNameStart === 'row')
        {
            obj1 = sudData.row;
        }
        else if (classNameStart === 'col')
        {
            obj1 = sudData.col;
        }
        
        if (classNameStart === 'val' || classNameStart === 'fil')
        {

        }
        else if (obj1)
        {
            obj1[className].filledNumbers.push(filledValue);

            i_removeValueFromArray(filledValue, obj1[classList[i]].remainingNumbers);
            indexRemainingValues[dictIndexRemainingValues[className]][1] -= 1;
        }

        
        obj1 = undefined;
    }
}

function trimInputCellValue(event)
{
    let inputElemWithValue = event.target;
    inputElemWithValue.value = inputElemWithValue.value.trim();
    
    let currCellValue = inputElemWithValue.value;
    AddRemoveDataClasses(inputElemWithValue.parentElement, currCellValue)

    //to cover the case where value would be removed; this is only possible in case of manual usage
    if ($(inputElemWithValue.parentElement).hasClass('filled'))
    {
        getDataFrom(inputElemWithValue.parentElement);
    }
}




function i_removeValueFromArray(valToBeRemoved, fromArray)
{
    for(let i = 0; i < fromArray.length; i++)
    { 
        if ( fromArray[i] === valToBeRemoved) {
            fromArray.splice(i, 1); 
            }
    }
}


let arrBoxRemainingValues = [];
let arrRowRemainingValues = [];
let arrColumnRemainingValues = [];

function getSortableArrays()
{
    let indexNameStart; 
    let indexCode; //{remaining value} - {row/column/boxname} this will be used to sort on remaining values
    for (let i=0; i<indexRemainingValues.length; i++)
    {
        indexNameStart = indexRemainingValues[i][0].substr(0, 3);
        indexCode = String(indexRemainingValues[i][1]) + "-" + indexRemainingValues[i][0];
        if (indexNameStart === 'box')
        {
            arrBoxRemainingValues.push(indexCode)
            
        }
        else if (indexNameStart === 'row')
        {
            arrRowRemainingValues.push(indexCode)
        }
        else if (indexNameStart === 'col')
        {
            arrColumnRemainingValues.push(indexCode)
        }
    }
}


/* 
function take classname as parameter = boxA, boxB, ... row1, row2, ... col1, col2, .... 
and returns box, row, class. this can be used for getting appropriate data from sudata object. 
*/
function getClassType(className)
{
    let classNameStart = className.substr(0, 3);
    return classNameStart;
}

function saveMe()
{
    let a = document.querySelectorAll('.inputCell')
    let b=[]; 
    for (let i=0; i<a.length; i++)
    {
        b.push(a[i].value)
    }
    
    let savedData;

    if (localStorage.savedSudoku)
    {
        savedData = JSON.parse(localStorage.savedSudoku)
    }
    else
    {
        savedData = {};
    }
    let oD = new Date();
    savedData[oD.toLocaleString()] = b;
    // JSON.stringify(g.b);
    localStorage.savedSudoku = JSON.stringify(savedData);
}

function getSavedData()
{
    if (localStorage.savedSudoku)
    {
        return JSON.parse(localStorage.savedSudoku)
    }
    else
    {
        console.log("no saved data found")
        return -1
    }
}

function restoreFrom(arrData)
{
    renderData(arrData);
    updateDataClasses();
    getData();
    updateData();
}

/* 

solving code starts here

*/


/* 
main function to solve
*/
function Solve()
{
    let a = Date.now();

    let initialEmptyCells = $('.Empty').length;
    let finalEmptyCellNumber;

    do 
    {

        initialEmptyCells = $('.Empty').length;
        fillPossibleValuesinBoxes();
        loopThrough('.row');
        loopThrough('.col');
        loopThrough('.box');

        findAndFillOne();
        // fillPossibleValuesinBoxes()
        
        finalEmptyCellNumber = $('.Empty').length;

        // console.log(initialEmptyCells, finalEmptyCellNumber)

    } while (initialEmptyCells > finalEmptyCellNumber && !isBoardComplete())

    
    console.log(Date.now() - a);
}


/* 
function to check if there is only one remaining, if there is then complete it
*/
function findAndFillOne()
{
    let arrSingleRemaining;
    
    do 
    {
        arrSingleRemaining = [];

        for (i in indexRemainingValues)
        {
            if (indexRemainingValues[i][1] === 1)
            {
                arrSingleRemaining.push(indexRemainingValues[i]);
            }
        }

        let remClassName;
        for (j in arrSingleRemaining)
        {
            remClassName = arrSingleRemaining[j][0];
            cellTofill = $('.' + remClassName + '.Empty input')[0];
            valueTofill = sudData[getClassType(remClassName)][remClassName].remainingNumbers[0]
            if (cellTofill && !isBoardComplete())
            {
                addValue(cellTofill, valueTofill);
            }
            
        }
        
    } while (arrSingleRemaining.length > 0 && !isBoardComplete())
    
}

/* 
function gets and fills possible values in each box
*/
function fillPossibleValuesinBoxes()
{
    let initialEmptyCellNumber;
    let finalEmptyCellNumber;
    do 
    {
        initialEmptyCellNumber = $('.Empty').length;

        for (let i=0; i<alphabets.length && !isBoardComplete(); i++)
        {
            fillPossibleValuesFor('.box' + alphabets[i]);
        }

        finalEmptyCellNumber = $('.Empty').length;

    }while (initialEmptyCellNumber > finalEmptyCellNumber)
    

    if (isBoardComplete())
    {
        // alert("complete!")
        // document.body.append("COMPLETE!")
    }
}

/* 
function loops through all empty cells of given box (passed as param)
and gets possible values for each cell
*/
function fillPossibleValuesFor(param)
{

    let endClassNameString = ' .Empty'
    let emptyCells = $(param + endClassNameString);
    let initialEmptyCellNumber = emptyCells.length;

    let finalEmptyCellNumber; 
    let currEmptyCell; 
    let possibleValues = [];
    let strPossibleValueAttributeVal = "";
    do 
    {
        emptyCells = $(param + endClassNameString);
        initialEmptyCellNumber = emptyCells.length;
        
        for (let i=0; i<emptyCells.length; i++)
        {
            currEmptyCell = emptyCells[i];
            possibleValues = getPossibleValuesForAllCells(currEmptyCell);
            if (possibleValues.length === 1)
            {
                addValue(currEmptyCell.children[0], possibleValues[0]);
            }
            else
            {
                // strPossibleValueAttributeVal = 'PsblVal' + possibleValues.toString();
                $(currEmptyCell).addClass('PsblVal');
                $(currEmptyCell).attr("possibleValues", possibleValues.toString());
            }
        }

        finalEmptyCellNumber = $(param + endClassNameString).length;

    }while (initialEmptyCellNumber > finalEmptyCellNumber)

}


/* 
    function calculates possible value for each empty call 
    based on the remaining values in the box it belongs to; 
    filled values in the column and 
    filled values in the row.
*/
function getPossibleValuesForAllCells(emptyCell)
{
    let classList = emptyCell.classList.toString().split(" ");
    //expected classlist is in the array with values such as 
    //["row2", "col3", "boxA", "sector1", "sector4", "Empty"]
    
    let row = classList[0]
    let col = classList[1]
    let box = classList[2]

    let possibleValues = [];
    possibleValues = sudData.box[box].remainingNumbers.slice();

    filledValuesCol = sudData.col[col].filledNumbers.slice();
    filledValuesRow = sudData.row[row].filledNumbers.slice();

    for (j in filledValuesCol)
    {
        i_removeValueFromArray(filledValuesCol[j], possibleValues);
    }

    for (j in filledValuesRow)
    {
        i_removeValueFromArray(filledValuesRow[j], possibleValues);
    }

    return possibleValues;

    

}




/* 
function is used to add values to a cell;
all housekeeping tasks - adding classes, updating data should be taken care of by this function internally
*/
function addValue(elemToAdd, valueToAdd)
{
    valueToAdd = String(valueToAdd);
    elemToAdd.value = String(valueToAdd).trim();
    let parentElem = elemToAdd.parentElement;
    AddRemoveDataClasses(parentElem, valueToAdd);
    getDataFrom(parentElem);
}

/* 

function checks if there are any remaining empty values. 
returns false if there are remaining values, 
else returns true when the board is complete. 

*/
function isBoardComplete()
{
    if ($('.Empty').length === 0)
    {
        return true;
    }
    else
    {
        return false;
    }
}


/* 
function loops through empty cells and returns possible values for each empty cell
*/
function getUniquePossibleValuesIn(param)
{
    let strClassName;
    if (param.indexOf('box') === -1) 
    {
        strClassName = param + '.Empty'
    }
    else
    {
        strClassName = param + ' .Empty'
    }
    let emptyCells = $(strClassName);
    let currCell;

    let arrArrayofArrayPossibleValues = []
    let arrCurrPossibleValues = [];
    for (let i=0; i<emptyCells.length; i++)
    {
        currCell = emptyCells[i];
        // console.log("classlist", currCell.classList);
        arrCurrPossibleValues = $(currCell).attr("possiblevalues").split(",")
        // console.log(currCell)
        // console.log("possibleValues, ", arrCurrPossibleValues) //$($0)
        
        arrArrayofArrayPossibleValues.push(arrCurrPossibleValues)
    }

    // console.log(getUniqueValueFromArrays(arrArrayofArrayPossibleValues))
    if (emptyCells.length > 0)
    {
        return getUniqueValueFromArrays(arrArrayofArrayPossibleValues);
    }
    else
    {
        return -1;
    }
    

}

/* 
function returns unique value and the array index in which it is found
*/
function getUniqueValueFromArrays(param)
{
    // console.log(param)
    let combinedString = param[0].toString();
    let arrReturn = [];

    let uniqueOccurancesDetails = {};
    uniqueOccurancesDetails.value = -1;
    uniqueOccurancesDetails.index = -1;

    for (let i=1; i<param.length; i++)
    {
        combinedString += "," + param[i].toString();
    }

    //loop through each param array and find out if there is a unique value in it
    // if there is add the value and the index of array (in which it is found) to the returning object
    let currArray = [];
    let occurancesInCombinedString = -1;
    for (i=0; i<param.length; i++)
    {
        currArray = param[i];
        for (let j=0; j<currArray.length; j++)
        {
            occurancesInCombinedString = combinedString.split(currArray[j]).length - 1;
            if (occurancesInCombinedString === 1)
            {
                uniqueOccurancesDetails.value = currArray[j];
                uniqueOccurancesDetails.index = i;
                arrReturn.push(JSON.parse(JSON.stringify(uniqueOccurancesDetails)));
                j = currArray.length + 1; //end loop.
            }
        }
    }

    return arrReturn;
}


/* 
loop through all rows / columns as decided by param '.row' or '.col'
*/
function loopThrough(param)
{
    let initialEmptyCells = $('.Empty').length;
    let countOfEmptyCellsAfterAddingValues = -1;

    let uniquePossibleValue;
    let strLoopInClassName = "";

    let uniqueVal = -1;
    let indexOfUniqueVal = -1;
    let elemToAdd;

    do
    {
        //loop through rows/columns
        for (let i=1; i<=9; i++)
        {
            strLoopInClassName = param + String(i).trim();
            uniquePossibleValue = getUniquePossibleValuesIn(strLoopInClassName);

            if (uniquePossibleValue === -1)
            {
                // console.log("no empty cells")
            }
            else if (uniquePossibleValue.length === 1)
            {
                uniqueVal = Number(uniquePossibleValue[0].value);
                indexOfUniqueVal = uniquePossibleValue[0].index;
                if (param.indexOf('box') > -1)
                {
                    strLoopInClassName += " ";
                }
                elemToAdd = $(strLoopInClassName + '.Empty')[indexOfUniqueVal].children[0];
                addValue(elemToAdd, uniqueVal);
            }
            
        }

        countOfEmptyCellsAfterAddingValues = $('.Empty').length;

    } while (initialEmptyCells < countOfEmptyCellsAfterAddingValues)

}

/* 
function to take array as parameter and update localstorage object from which data is loaded
*/
function loadNewSudo(param)
{
    let g = {}
    g.b = param;
    localStorage.sudoku = JSON.stringify(g);
}


function generateSudokuDataFromGoogleSheet(strParam)
{
    let replacedHashWithBlanks = strParam.replace(/#/g, ' ');
    let arrData = replacedHashWithBlanks.split(",");
    arrData.pop;
    return arrData
}

/* functions to generate the functions to be used for google sheet data generation
this is not part of the solving code.
COPY final string and pass it to the generate sudoku data function */

//param1 = 75 for starting with K and parm2 = 1 for K1, L1, M1...
function callGenerateFunction(param1, param2)
{
    strRet = '';
    strRet = generateFunction(param1, param2) + generateFunction(param1,param2 + 1) + generateFunction(param1,param2 + 2);
    return strRet;
}

function generateFunction(param1, param2)
{
    //(K1,",",L1,",",M1,",",K2,",",L2,",",M2,",",K3,",",L3,",",M3, ","
    let strRet = ""
    for (var i=0; i<3; i++)
    {
        strRet += String.fromCharCode(param1 + i) + String(param2).trim() + ',",",'
    }
    return strRet;
}

//list of intresting websites to generate sudoku, also sudoku solvers
/* 
sudoku solver with steps
http://www.sudokuwiki.org/sudoku.htm


*/

/* 
let a = [1, 2, 3];
let b = [1, 4, 5];
let c = [2, 3];
let d = [1, 3];

a, c and d make 1, 2, and 3. 
b can be removed of 1
*/

function test1(param)
{
    
}