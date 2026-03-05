import '@testing-library/jest-dom'

import { vi } from 'vitest';

global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};