// Initialze Game Board On Page Load

initCatRow();
initBoard();
getCategoryIds();

document.querySelector("button").addEventListener("click", setupAndStart);

// Create Category Row

function initCatRow() {
	let catRow = document.getElementById("category-row");

	for (let i = 0; i < 6; i++) {
		let box = document.createElement("div");
		box.className = "clue-box category-box";
		catRow.appendChild(box);
	}
}

// Create Clue Board

function initBoard() {
	let board = document.getElementById("clue-board");

	// Generate 5 Rows, Then Place 6 Boxes In Each Row

	for (let i = 0; i < 5; i++) {
		let row = document.createElement("div");
		let boxValue = 200 * (i + 1);
		row.className = "clue-row";

		for (let j = 0; j < 6; j++) {
			let box = document.createElement("div");
			box.className = "clue-box";
			box.textContent = "$" + boxValue;

			box.addEventListener("click", getClue, false);
			row.appendChild(box);
		}
		board.appendChild(row);
	}
}

let catArray = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	const results = await axios.get(
		"https://rithm-jeopardy.herokuapp.com/api/categories?count=100"
	);
	const allCategories = results.data;
	const categories = [];
	for (let i = 0; i < 6; i++) {
		let randomIdx = Math.floor(Math.random() * allCategories.length);
		let randomCategory = allCategories[randomIdx];
		allCategories.splice(randomIdx, 1);
		categories.push(randomCategory.id);
	}
	return categories;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
	const results = await axios.get(
		"https://rithm-jeopardy.herokuapp.com/api/category?id=" + catId
	);
	console.log(results.data);
	catArray = results.data;
	return catArray;
	setCategories(catArray);
}

// Load Categories To The Board

function setCategories(catArray) {
	let element = document.getElementById("category-row");
	let children = element.children;
	for (let i = 0; i < children.length; i++) {
		children[i].innerHTML = catArray[i].title;
	}
}

// wrap code that depends on async in try/catches

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

//Figure Out Which Item Was Clicked

function getClue(event) {
	let child = event.currentTarget;
	child.classList.add("clicked-box");
	let boxValue = child.innerHTML.slice(1);
	let parent = child.parentNode;
	let index = Array.prototype.findIndex.call(
		parent.children,
		(c) => c === child
	);
	let clueList = catArray[index].clues;
	let clue = clueList.find((obj) => {
		return obj.value == boxValue;
	});
	console.log(clue);
	showQuestion(clue, child, boxValue);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	const categoriesIds = await getCategoryIds();
	categories = await Promise.all(
		categoriesIds.map(async (categoryId) => await getCategory(categoryId))
	);
	// console.log(categories);
}

setupAndStart();

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
