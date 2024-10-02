const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
    let options = new chrome.Options();
    options.addArguments('headless');  // Run Chrome in headless mode
    options.addArguments('disable-gpu'); // Disable GPU acceleration
    options.addArguments('no-sandbox');  // Bypass OS security model
    options.addArguments('disable-dev-shm-usage'); // Overcome limited resource problems
    
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    
    try {
        // Navigate to your app's URL
        await driver.get('http://localhost:3000');
        
        // Example: Find an element by its name and click it
        let element = await driver.findElement(By.name('exampleButton'));
        await element.click();

        // Example: Wait for an element to appear after click (e.g., a result)
        let resultElement = await driver.wait(until.elementLocated(By.id('result')), 10000);
        console.log(await resultElement.getText());

    } finally {
        await driver.quit();
    }
}

runTest();
