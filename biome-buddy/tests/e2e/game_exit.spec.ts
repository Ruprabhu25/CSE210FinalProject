import { test, expect } from '@playwright/test';
import {pageUrl, maxPlayerActions, runSomeRoundsOfGame, checkAndInteractWithPopup} from '../../e2e_helper';

test('Starts playing and then leaves', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.locator('span').nth(3).click();
  await page.locator('span').nth(1).click();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Go back' }).click();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
});

test('start game, go back to home page, and start off where left off', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  // take some actions to change the state of the game
  const intendedPlayerActions = Array(5).fill('Grass');
  const gameEnded = await runSomeRoundsOfGame(page, intendedPlayerActions);
  expect(gameEnded).toBe(false); // game should take longer than 5 actions to end, so expect false
  // exit game and resume
  await checkAndInteractWithPopup(page);
  await page.locator('button.home-button').click();
  await page.getByRole('button', { name: 'Save and Exit' }).click();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Yes, Resume' }).click();
  await page.getByRole('button', { name: 'Continue Playing' }).click();
  // check that game log still has contents
  const gameLogSeasonEntries = page.locator('.game-log-season');
  expect(await gameLogSeasonEntries.count()).toBeGreaterThan(1);
});

test('start game, exit and save, refresh, and start off where left off', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  // take some actions to change the state of the game
  const intendedPlayerActions = Array(5).fill('Grass');
  const gameEnded = await runSomeRoundsOfGame(page, intendedPlayerActions);
  expect(gameEnded).toBe(false); // game should take longer than 5 actions to end, so expect false
  // exit game and resume
  await checkAndInteractWithPopup(page);
  await page.locator('button.home-button').click();
  await page.getByRole('button', { name: 'Save and Exit' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Yes, Resume' }).click();
  await page.getByRole('button', { name: 'Continue Playing' }).click();
  // check that game log still has contents 
  const gameLogSeasonEntries = page.locator('.game-log-season');
  expect(await gameLogSeasonEntries.count()).toBeGreaterThan(1);
});

test('start game, go back to home page, and start a new game', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  // take some actions to change the state of the game
  const intendedPlayerActions = Array(5).fill('Grass');
  const gameEnded = await runSomeRoundsOfGame(page, intendedPlayerActions);
  expect(gameEnded).toBe(false); // game should take longer than 5 actions to end, so expect false
  // exit game and start a new one
  await checkAndInteractWithPopup(page);
  await page.locator('button.home-button').click();
  await page.getByRole('button', { name: 'Save and Exit' }).click();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'No, Start New' }).click();
  // check that game log has been emptied
  const gameLogSeasonEntries = page.locator('.game-log-season');
  expect(await gameLogSeasonEntries.count()).toBeLessThan(2);
});  

test('start game, go back to home page without saving, start new game', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  // take some actions to change the state of the game
  const intendedPlayerActions = Array(5).fill('Grass');
  const gameEnded = await runSomeRoundsOfGame(page, intendedPlayerActions);
  expect(gameEnded).toBe(false); // game should take longer than 5 actions to end, so expect false
  // exit game without saving and start a new one
  await checkAndInteractWithPopup(page);
  await page.locator('button.home-button').click();
  await page.getByRole('button', { name: 'Just Exit' }).click();
  await page.getByRole('button', { name: 'Start Game' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  // check that game log has been emptied
  const gameLogSeasonEntries = page.locator('.game-log-season');
  expect(await gameLogSeasonEntries.count()).toBeLessThan(2);
});  


