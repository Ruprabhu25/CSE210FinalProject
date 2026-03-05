import { expect } from '@playwright/test';

const popupClass = '.actions';
const pageUrl = 'http://localhost:5173/';

const maxPlayerActions = 5 * 4 * 3; // years * seasons * roundsInSeason

const checkForPopup = async (page) => {
  const popupLocator = page.locator(popupClass);
  return await popupLocator.isVisible();
};

const interactWithPopup = async (page) => {
  await page.locator('button.primary').nth(0).click();
};


// returns true if a popup was visible and interacted with, false otherwise
const checkAndInteractWithPopup = async (page) => {
  const popupLocator = page.locator(popupClass);
  if (await popupLocator.isVisible()) {
    // click the first button in the popup to proceed with the next action
    await page.locator('button.primary').nth(0).click();
    return true;
  }
  return false;
};

const clickSpecies = async (page, speciesName) => {
  await page.getByRole('img', { name: speciesName }).click();
};

// returns true if the game has ended, false otherwise
const checkForGameEnd = async (page) => {
  const endGamePopup = page.locator('.endScreen');
  return endGamePopup.isVisible();
};

// returns false if the game has ended, true otherwise
const attemptNextDesiredPlayerAction = async (page, speciesName) => {
  const occurrenceMap = {
    'game-end': false,
    'disaster': false,
    'species-clicked': false,
  }

  // Check if game has ended
  if (await checkForGameEnd(page)) {
    occurrenceMap['game-end'] = true;
    return occurrenceMap;
  }

   // Check if popup occured
  if (await checkForPopup(page)) {
    occurrenceMap['disaster'] = true;
    return occurrenceMap;
  }

  // If the game hasn't ended, proceed with clicking the desired species
  await clickSpecies(page, speciesName);
  occurrenceMap['species-clicked'] = true;
  return occurrenceMap; 
};

// lacks some checks that runFullGameLoop has, such as checking for disasters and counting them
// returns true if game ended during the rounds, false otherwise
const runSomeRoundsOfGame = async (page, intendedPlayerActions) => {
  // run the rounds
  let playerActionIndex = 0;
  while (playerActionIndex < intendedPlayerActions.length) {
    const occurrenceMap = await attemptNextDesiredPlayerAction(page, intendedPlayerActions[playerActionIndex]);

    if (occurrenceMap['game-end']) {
      return true; 
    }

    if(occurrenceMap['disaster']) {
      // interact with popup to continue
      await checkAndInteractWithPopup(page);
    }
    if (occurrenceMap['species-clicked']) {
      playerActionIndex += 1;
    }
  }
  return false; 
}

// intendedPlayerAction is an array of species names that the player intends to click on, should be large enough to end the game
const runFullGameLoop = async (page, intendedPlayerActions) => {
  // Set up initial state for later comparison
  const gameLogDisasters = page.locator('.game-log-disaster');
  let currentDisasterCount = 0;

  // run the rounds
  let gameActive = true;
  let playerActionIndex = 0;
  while (gameActive && playerActionIndex < intendedPlayerActions.length) {
    const occurrenceMap = await attemptNextDesiredPlayerAction(page, intendedPlayerActions[playerActionIndex]);

    // check what happened and perform checks and interactions accordingly
    if (occurrenceMap['game-end']) {
      gameActive = false;
    }

    if(occurrenceMap['disaster']) {
      currentDisasterCount += 1;
      expect(await gameLogDisasters.count()).toBe(currentDisasterCount);
      // interact with popup to continue
      await checkAndInteractWithPopup(page);
    }
    if (occurrenceMap['species-clicked']) {
      playerActionIndex += 1;
    }
  }
  return !gameActive; // returns true if game ended, false otherwise
};

export {
    popupClass,
    pageUrl,
    maxPlayerActions,
    checkForPopup,
    interactWithPopup,
    checkAndInteractWithPopup,
    clickSpecies,
    checkForGameEnd,
    attemptNextDesiredPlayerAction,
    runSomeRoundsOfGame,
    runFullGameLoop,
}