import { test, expect } from '@playwright/test';

test('Payment Details page should load successfully', async ({ page }) => {
  // Navigate to the payment details page
  await page.goto('http://localhost:8080/pay/p-1421/details?service=aramex&country=SA&currency=SAR');

  // Wait for the main container to be visible
  await page.waitForSelector('h1.text-xl.sm\\:text-3xl.font-bold', { timeout: 10000 });

  // Check for the header title
  const headerTitle = await page.textContent('h1.text-xl.sm\\:text-3xl.font-bold');
  expect(headerTitle).toContain('تفاصيل الدفع');

  // Check for the presence of the "Proceed" button
  const proceedButton = await page.waitForSelector('button:has-text("متابعة الدفع")', { timeout: 5000 });
  expect(proceedButton).not.toBeNull();

  // Take a screenshot of the page
  await page.screenshot({ path: 'payment-details.png' });
});

test('Recipient Data page should load successfully', async ({ page }) => {
  // Navigate to the recipient data page
  await page.goto('http://localhost:8080/pay/p-1421/recipient?service=aramex&country=SA&currency=SAR');

  // Wait for the main container to be visible
  await page.waitForSelector('h1.text-xl.sm\\:text-3xl.font-bold', { timeout: 10000 });

  // Check for the header title
  const headerTitle = await page.textContent('h1.text-xl.sm\\:text-3xl.font-bold');
  expect(headerTitle).toContain('بيانات المستلم');

  // Check for the presence of the form
  const form = await page.waitForSelector('form', { timeout: 5000 });
  expect(form).not.toBeNull();

  // Take a screenshot of the page
  await page.screenshot({ path: 'recipient-data.png' });
});

test('Card Data page should load successfully', async ({ page }) => {
  // Navigate to the card data page
  await page.goto('http://localhost:8080/pay/p-1421/card-input?service=aramex&country=SA&currency=SAR');

  // Wait for the main container to be visible
  await page.waitForSelector('h1.text-xl.sm\\:text-3xl.font-bold', { timeout: 10000 });

  // Check for the header title
  const headerTitle = await page.textContent('h1.text-xl.sm\\:text-3xl.font-bold');
  expect(headerTitle).toContain('بيانات البطاقة');

  // Check for the presence of the card form
  const cardForm = await page.waitForSelector('form', { timeout: 5000 });
  expect(cardForm).not.toBeNull();

  // Take a screenshot of the page
  await page.screenshot({ path: 'card-data.png' });
});

test('Verification Code page should load successfully', async ({ page }) => {
  // Navigate to the verification code page
  await page.goto('http://localhost:8080/pay/p-1421/otp?service=aramex&country=SA&currency=SAR');

  // Wait for the main container to be visible
  await page.waitForSelector('h1.text-lg.sm\\:text-2xl.font-bold', { timeout: 10000 });

  // Check for the header title
  const headerTitle = await page.textContent('h1.text-lg.sm\\:text-2xl.font-bold');
  expect(headerTitle).toContain('رمز التحقق');

  // Check for the presence of the OTP input
  const otpInput = await page.waitForSelector('div[class*="InputOTPGroup"]', { timeout: 5000 });
  expect(otpInput).not.toBeNull();

  // Take a screenshot of the page
  await page.screenshot({ path: 'verification-code.png' });
});
