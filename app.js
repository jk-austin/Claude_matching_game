let cards = [];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let triesRemaining = 6;
let isProcessing = false;

// Load cards from JSON and initialize game
async function loadCards() {
    try {
        const response = await fetch('cards.json');
        cards = await response.json();
        initGame();
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

// Initialize the game
function initGame() {
    // Create pairs of cards
    gameCards = [...cards, ...cards];
    
    // Shuffle cards
    shuffleCards();
    
    // Render cards
    renderCards();
    
    // Reset game state
    flippedCards = [];
    matchedPairs = 0;
    triesRemaining = 6;
    isProcessing = false;
    
    updateTriesDisplay();
    hidePlayAgainButton();
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }
}

// Render cards to the grid
function renderCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';
    
    gameCards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardGrid.appendChild(cardElement);
    });
}

// Create a single card element
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.dataset.index = index;
    cardDiv.dataset.name = card.name;
    
    cardDiv.innerHTML = `
        <div class="card-inner">
            <div class="card-back"></div>
            <div class="card-face">${card.image}</div>
        </div>
    `;
    
    cardDiv.addEventListener('click', () => handleCardClick(cardDiv));
    
    return cardDiv;
}

// Handle card click
function handleCardClick(cardElement) {
    // Ignore clicks if processing or card already flipped/matched
    if (isProcessing || 
        cardElement.classList.contains('flipped') || 
        cardElement.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    flippedCards.push(cardElement);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        isProcessing = true;
        checkForMatch();
    }
}

// Check if flipped cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const card1Name = card1.dataset.name;
    const card2Name = card2.dataset.name;
    
    if (card1Name === card2Name) {
        // Match found
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            flippedCards = [];
            isProcessing = false;
            
            // Check if game is won
            if (matchedPairs === 6) {
                setTimeout(() => {
                    alert('Congratulations, you won!');
                    showPlayAgainButton();
                }, 500);
            }
        }, 1000);
    } else {
        // No match - wait 1 second, then flip back
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            
            flippedCards = [];
            isProcessing = false;
            
            // Decrease tries
            triesRemaining--;
            updateTriesDisplay();
            
            // Check if game is lost
            if (triesRemaining === 0) {
                setTimeout(() => {
                    alert('Sorry, you lost.');
                    showPlayAgainButton();
                }, 1000);
            }
        }, 2000); // 1 second delay + 1 second for flip animation
    }
}

// Update tries display
function updateTriesDisplay() {
    document.getElementById('triesCount').textContent = triesRemaining;
}

// Show play again button
function showPlayAgainButton() {
    const btn = document.getElementById('playAgainBtn');
    btn.classList.remove('hidden');
}

// Hide play again button
function hidePlayAgainButton() {
    const btn = document.getElementById('playAgainBtn');
    btn.classList.add('hidden');
}

// Play again button handler
document.getElementById('playAgainBtn').addEventListener('click', () => {
    location.reload();
});

// Start the game when page loads
loadCards();
