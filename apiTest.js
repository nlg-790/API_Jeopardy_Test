const game = document.getElementById('game');
const currentScore = document.getElementById('score');

// API base URL
const BASE_API_URL = "https://rithm-jeopardy.herokuapp.com/api/";

// Number of categories and questions per category to fetch
const NUM_CATEGORIES = 6;
const NUM_QUESTIONS_PER_CATEGORY = 5;

// Fetch categories from API
async function fetchCategories() {
  try {
    const response = await axios.get(`${BASE_API_URL}categories?count=${NUM_CATEGORIES}`);
    return response.data; // This will be an array of categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return an empty array on error
  }
}

// Fetch clues for a given category from API
async function fetchCluesForCategory(categoryId) {
  try {
    const response = await axios.get(`${BASE_API_URL}category?id=${categoryId}`);
    return response.data.clues.slice(0, NUM_QUESTIONS_PER_CATEGORY); // Get the first 5 clues
  } catch (error) {
    console.error(`Error fetching clues for category ${categoryId}:`, error);
    return []; // Return an empty array on error
  }
}

// Create and fill the game board with categories and clues
async function getCategory(category) {
  const column = document.createElement('div');
  column.classList.add('column');

  const topicTitle = document.createElement('div');
  topicTitle.classList.add('title');
  topicTitle.innerText = category.title;

  column.appendChild(topicTitle);
  game.append(column);

  // Fetch clues for this category
  const clues = await fetchCluesForCategory(category.id);
  clues.forEach(clue => {
    const trivia = document.createElement('div');
    trivia.classList.add('trivia');
    trivia.innerHTML = '?';
    column.append(trivia);

    // Setting attributes to hold the clue data
    trivia.setAttribute('question', clue.question);
    trivia.setAttribute('answer', clue.answer);
    trivia.setAttribute('showing', 'null');

    // Event listener to handle click and reveal question/answer
    trivia.addEventListener('click', function() {
      if (this.getAttribute('showing') === 'null') {
        this.innerHTML = this.getAttribute('question');
        this.setAttribute('showing', 'question');
      } else if (this.getAttribute('showing') === 'question') {
        this.innerHTML = this.getAttribute('answer');
        this.setAttribute('showing', 'answer');
      }
    });
  });
}

// Setup and start the game by fetching categories and filling the table
async function setupAndStart() {
  game.innerHTML = ''; // Clear the game board
  const categories = await fetchCategories();
  for (const category of categories) {
    await getCategory(category); // Get each category and its clues
  }
}

// Event listener for the reset button
document.getElementById('reset').addEventListener('click', setupAndStart);

// Initialize the game when the page loads
setupAndStart();
