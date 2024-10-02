const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTests() {
    let options = new chrome.Options();
    options.addArguments('headless');  // Run Chrome in headless mode
    options.addArguments('disable-gpu');
    options.addArguments('no-sandbox');
    options.addArguments('disable-dev-shm-usage');
    
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Test 1: Verify Page Title
        await driver.get('http://localhost:3000');
        let title = await driver.getTitle();
        console.log(`Page title: ${title}`);
        if (title === "React App") {
            console.log("Test 1 Passed: Page title is correct.");
        } else {
            console.log("Test 1 Failed: Incorrect page title.");
        }

        // Test 2: Verify React Logo is Displayed
        let logo = await driver.findElement(By.className('App-logo'));
        let isLogoDisplayed = await logo.isDisplayed();
        console.log(`React logo is ${isLogoDisplayed ? "displayed" : "not displayed"}`);
        if (isLogoDisplayed) {
            console.log("Test 2 Passed: React logo is displayed.");
        } else {
            console.log("Test 2 Failed: React logo is not displayed.");
        }

        // Test 3: Verify "Learn React" Link
        let learnReactLink = await driver.findElement(By.linkText('Learn React'));
        let isLinkDisplayed = await learnReactLink.isDisplayed();
        let linkHref = await learnReactLink.getAttribute('href');
        console.log(`"Learn React" link is ${isLinkDisplayed ? "displayed" : "not displayed"}`);
        if (isLinkDisplayed && linkHref === 'https://reactjs.org/') {
            console.log("Test 3 Passed: 'Learn React' link is correct.");
        } else {
            console.log("Test 3 Failed: 'Learn React' link is incorrect.");
        }

        // Test 4: Verify "Edit src/App.js" Text is Displayed
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Edit')]")), 10000); // Wait for up to 10 seconds
        let editText = await driver.findElement(By.xpath("//*[contains(text(),'Edit')]"));
        let isTextDisplayed = await editText.isDisplayed();
        console.log(`"Edit src/App.js" text is ${isTextDisplayed ? "displayed" : "not displayed"}`);
        if (isTextDisplayed) {
            console.log("Test 4 Passed: 'Edit src/App.js' text is displayed.");
        } else {
            console.log("Test 4 Failed: 'Edit src/App.js' text is not displayed.");
        }

        // Test 5: Measure Page Load Time
        let start = Date.now();
        await driver.get('http://localhost:3000');
        let end = Date.now();
        let loadTime = (end - start) / 1000;  // Convert to seconds
        console.log(`Page load time: ${loadTime} seconds.`);
        if (loadTime < 5) {
            console.log("Test 5 Passed: Page loaded within acceptable time.");
        } else {
            console.log("Test 5 Failed: Page load time exceeded acceptable limit.");
        }

    } finally {
        await driver.quit();
    }
}

runTests();
