import { test, expect } from '@playwright/test';

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

// intendedPlayerAction is an array of species names that the player intends to click on, it should be as large as needed to ensure the game ends by the end of the array
const runFullGameLoop = async (page, intendedPlayerActions) => {
  // Set up initial state for later comparison
  const gameLogDisasters = page.locator('.game-log-disaster');
  let currentDisasterCount = 0;

  // run the rounds
  let gameActive = true;
  let playerActionIndex = 0;
  while (gameActive) {
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
};

test('Starts playing and then leaves', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.locator('span').nth(3).click();
  await page.locator('span').nth(1).click();
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
});

test('Keep touching grass', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  const intendedPlayerActions = Array(maxPlayerActions).fill('Grass');
  await runFullGameLoop(page, intendedPlayerActions);
});

test('Release the hawks', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  const intendedPlayerActions = Array(maxPlayerActions).fill('Hawk');
  await runFullGameLoop(page, intendedPlayerActions);
});


