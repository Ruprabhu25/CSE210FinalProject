import { test, expect } from '@playwright/test';
import {pageUrl, maxPlayerActions, runFullGameLoop} from '../../e2e_helper';

/* test('Keep touching grass', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  const intendedPlayerActions = Array(maxPlayerActions).fill('Grass');
  const gameEnded = await runFullGameLoop(page, intendedPlayerActions);
  expect(gameEnded).toBe(true);
}); */

/* test('Release the hawks', async ({ page }) => {
  await page.goto(pageUrl);
  await page.getByRole('button', { name: 'Choose Forest Biome' }).click();
  await page.getByRole('button', { name: 'Get started' }).click();
  await page.getByRole('button', { name: 'Start Playing' }).click();
  const intendedPlayerActions = Array(maxPlayerActions).fill('Hawk');
  const gameEnded = await runFullGameLoop(page, intendedPlayerActions);
  expect(gameEnded).toBe(true);
}); */