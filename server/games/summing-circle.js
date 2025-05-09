const slotLineWidth = 4;
const maxNumber = 30;
const operations = ["+", "-", "*", "/"];

let slotSize = 40;
let totalSlots = 24;
let radius = 180;
let yOffset = 0;
let used_div_mult_one = false;

let barPos = 250;
let barCount = 12;
let barSlotSpacing = 20;

let equation = ["7","+","4","=","11","*","3","=","33","-","12","=","21","/","3","="];

var slotsSolution = [];
var slots = [];
var barSlots = [];

function compareBarIcons(a, b)
{
	let iconA = getIconInEquation(a);
	let iconB = getIconInEquation(b);
	if (isOperationCharacter(iconA) && !isOperationCharacter(iconB))
	{
		return 1;
	}
	else if (!isOperationCharacter(iconA) && isOperationCharacter(iconB))
	{
		return -1;
	}
	else if (!isOperationCharacter(iconA) && !isOperationCharacter(iconB))
	{
		if (Number(iconA) < Number(iconB))
		{
			return -1;
		}
		else if (Number(iconA) > Number(iconB))
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}
	else
	{
		if (iconA == "+" && iconB != "+")
		{
			return -1;
		}
		else if (iconB == "+" && iconA != "+")
		{
			return 1;
		}
		else if (iconA == "-" && iconB != "-")
		{
			return -1;
		}
		else if (iconB == "-" && iconA != "-")
		{
			return 1;
		}
		else if (iconA == "*" && iconB != "*")
		{
			return -1;
		}
		else if (iconB == "*" && iconA != "*")
		{
			return 1;
		}
		else if (iconA == "/" && iconB != "/")
		{
			return -1;
		}
		else if (iconB == "/" && iconA != "/")
		{
			return 1;
		}
		else
		{
			return 0;
		}
	}
}

function getIconInEquation(index)
{
	var startIndex = 0;
	var endIndex = -1;
	var currentSlotIndex = 0;

	var onNumber = true;
	var changedIcon = false;

	if (index == totalSlots-1)
	{
		return equation.substring(equation.length-1);
	}

	for (let i = 0; i < equation.length; i++)
	{
		if (onNumber)
		{
			var isOperationChar = isOperationCharacter(equation[i])
			if (isOperationChar)
			{
				onNumber = false;
				endIndex = i;
				currentSlotIndex++;
				changedIcon = true;
			}
		}
		else
		{
			onNumber = true;
			endIndex = i;
			currentSlotIndex++;
			changedIcon = true;
		}

		if (currentSlotIndex > index)
		{
			return equation.substring(startIndex, endIndex);
		}

		if (changedIcon)
		{
			startIndex = endIndex;
		}
	}

	return "";
}

function isOperationCharacter(operation)
{
	return operations.includes(operation) || operation == '=';
}

function getRandomIntRange(min, max)
{
    return min + Math.floor(Math.random() * (max-min));
}

function isOperationValid(num, operation)
{
	if (operation == "+") {
		return num < maxNumber - 1;
    }
	else if (operation == "-") {
		return num > 1;
    }
    else if (operation == "*") {
		return num > 1;
    }
    else if (operation == "/") {
		return num > 1;
    }
    else if (operation == "%") {
		return num > 1;
    }

    return false;
}

function isNumberAllowed(number)
{
	if (Math.floor(number) == number && number > 0 && number <= maxNumber)
    {
		return true;
    }
	else
    {
		return false;
    }
}

function findBestFinalOperationAndNumber(num_a, result)
{
	let num_b = ["=", 0];
	let valid_nums = [];
	let num_b_addition = result - num_a;
	if (isNumberAllowed(num_b_addition) && operations.includes("+"))
    {
		valid_nums.push(["+", num_b_addition]);
    }
	let num_b_subtraction = -result + num_a;
	if (isNumberAllowed(num_b_subtraction) && operations.includes("-"))
    {
		valid_nums.push(["-", num_b_subtraction]);
    }
    let num_b_multiplication = result / num_a;
	if (isNumberAllowed(num_b_multiplication) && operations.includes("*"))
    {
		valid_nums.push(["*", num_b_multiplication]);
    }
    let num_b_division = num_a / result;
	if (isNumberAllowed(num_b_division) && operations.includes("/"))
    {
		valid_nums.push(["/", num_b_division]);
    }
    let num_b_modulo = num_a - result;
	if (isNumberAllowed(num_b_modulo) && operations.includes("%") && num_b_modulo != 1 && num_a % num_b_modulo == result)
    {
		valid_nums.push(["%", num_b_modulo]);
    }
	
	if (valid_nums.length > 0)
    {
		num_b = valid_nums[getRandomIntRange(0, valid_nums.length-1)];
    }
	else
    {
		alert("Error with puzzle creation");
    }
		
	return num_b
}

function findNumberForOperation(starting_number, operation)
{
	let result = -1;
	let suggested_number = 1;
	if (operation == "+")
	{
		suggested_number = 1;
		while (!isNumberAllowed(result))
		{
			suggested_number = getRandomIntRange(1, maxNumber);
			result = starting_number + suggested_number;
		}
	}
	else if (operation == "-")
	{
		suggested_number = 1;
		while (!isNumberAllowed(result))
		{
			suggested_number = getRandomIntRange(1, starting_number-1);
			result = starting_number - suggested_number;
		}
	}
	else if (operation == "*")
	{
		suggested_number = 1;
		let attempts = 0;
		while (!isNumberAllowed(result))
		{
			if (attempts > 100)
			{
				return [-1,-1];
			}
			let min_lim = 2;
			if (used_div_mult_one)
			{
				min_lim = 2;
			}
			suggested_number = getRandomIntRange(min_lim, maxNumber-1);
			result = starting_number * suggested_number;
			attempts += 1;
		}
		if (suggested_number == 1 || starting_number == 1)
		{
			used_div_mult_one = true;
		}
	}
	else if (operation == "/")
	{
		suggested_number = 1;
		let attempts = 0;
		while (!isNumberAllowed(result))
		{
			if (attempts > 100)
			{
				return [-1,-1];
			}
			var min_lim = 1;
			suggested_number = getRandomIntRange(2, starting_number-1);
			if (suggested_number == 0)
			{
				suggested_number = min_lim;
			}
			result = starting_number / suggested_number;
			attempts += 1;
		}
		if (suggested_number == 1 || starting_number == 1)
		{
			used_div_mult_one = true;
		}
	}
	else if (operation == "%")
	{
		suggested_number = 1;
		let attempts = 0;
		while (!isNumberAllowed(result) || result == starting_number - suggested_number)
		{
			if (attempts > 100)
			{
				return [-1,-1];
			}
			var min_lim = 2;
			suggested_number = getRandomIntRange(2, starting_number-1);
			if (suggested_number == 0)
			{
				suggested_number = min_lim;
			}
			result = starting_number % suggested_number;
			attempts += 1;
		}
		if (suggested_number == 1 || starting_number == 1)
		{
			used_div_mult_one = true;
		}
	}
	return [suggested_number, result];
}

function matchingNumbers(current_numbers, previous_numbers)
{
	let current1 = current_numbers[0];
	let matching1 = previous_numbers.includes(current1);
	let current2 = current_numbers[1];
	let matching2 = previous_numbers.includes(current2);
	let current3 = current_numbers[2];
	let matching3 = previous_numbers.includes(current3);
	return matching1 && matching2 && matching3;
}

function generateDailyPuzzle()
{
    let operations = ["+","-","*","/","%"]
    let equationString = "";
	let numbers = [];
    let numEquations = Math.floor(totalSlots/4);
	let starting_num = getRandomIntRange(1, maxNumber);
	numbers.push(starting_num);
	let num_a = starting_num;
	let previous_numbers = [0,0,0];
	used_div_mult_one = false;
	let equation_string = "";
    equation_string += starting_num.toString();
	for (let i = 0; i < numEquations-1; i++)
    {
		let results = [-1,-1];
		let random_operation = "+";
		let current_numbers = [0,0,0];
		while (results[0] == -1 && results[1] == -1)
        {
            do {
			    random_operation = operations[getRandomIntRange(0,operations.length-1)];
            }
			while (!isOperationValid(num_a, random_operation));
			results = findNumberForOperation(num_a, random_operation);
			current_numbers = [num_a, results[0], results[1]];
			if (matchingNumbers(current_numbers, previous_numbers))
            {
				results = [-1,-1];
            }
        }
		equation_string += random_operation + results[0].toString() + "=" + results[1].toString();
		numbers.push(results[0]);
		numbers.push(results[1]);
		previous_numbers = current_numbers;
		num_a = results[1];
    }
	let final_operation_and_number = findBestFinalOperationAndNumber(num_a, starting_num);
	numbers.push(final_operation_and_number[1]);
	equation_string += final_operation_and_number[0] + final_operation_and_number[1].toString() + "=";
	equation = equation_string;
}

function initSlots()
{
	let numNonEqualsIcons = totalSlots - totalSlots/4;

	let hiddenIconsIndices = [];
	while (hiddenIconsIndices.length < barCount)
	{
		let randomIndex = getRandomIntRange(0, numNonEqualsIcons);
		let adjustedRandomIndex = randomIndex + Math.floor(randomIndex / 3);  // Account for the equals icons

		if (!hiddenIconsIndices.includes(adjustedRandomIndex))
		{
			hiddenIconsIndices.push(adjustedRandomIndex);
		}
	}

    for (let i = 0; i < totalSlots; i++) 
    {
        slots[i] = !hiddenIconsIndices.includes(i) ? getIconInEquation(i) : "";
		slotsSolution[i] = getIconInEquation(i);
    }

	hiddenIconsIndices.sort(compareBarIcons);

	for (let i = 0; i < barCount; i++) 
	{
		barSlots[i] = getIconInEquation(hiddenIconsIndices[i]);
	}
}

function startGame()
{
    generateDailyPuzzle();
	initSlots();
	console.log("Done");

	return {
		initialIcons: slots,
		iconBar: barSlots,
	  
		solutionIcons: slotsSolution
	}
	  
}

module.exports = {
	startGame
}