
elements = {
    bars : document.querySelectorAll('.bar'),
    totalBalance : document.querySelector('.totalBalance'),
    mainContent : document.querySelector('.main-content'),
    forecastMessage : document.querySelector('.forecast-message')
}
const seasonImages = {
    balancedImage : {
        url : "images/balanced.webp",
        backgroundWidth : 180
    },
    springImage : {
        url : "images/spring.jpg",
        backgroundWidth : 120
    },
    summerImage : {
        url : "images/summer.webp",
        backgroundWidth : 100
    },
    autumnImage : {
        url : "images/autumn.jpg",
        backgroundWidth : 100
    },
    winterImage : {
        url : "images/winter.jpg!d",
        backgroundWidth : 100
    }
}
let seasonData = {
    spring : 100,
    summer : 100,
    autumn : 100,
    winter : 100 
}
function setBackground(url, width) {
    console.log(elements.mainContent)
    elements.mainContent.style.backgroundImage = "url('" + url + "')"
    elements.mainContent.style.backgroundSize =  "auto " + width + "%"
}
async function updateBalance(percentageArray, visualOnly) {
    for (let i = 0; i < elements.bars.length; i++) {
        let season = elements.bars[i]
        season.style.width = (percentageArray[i] / 2) + 'rem'
    }
    
    // update global percentages if not just visual
    if (visualOnly) { return }

    seasonData.spring = percentageArray[0]
    seasonData.summer = percentageArray[1]
    seasonData.autumn = percentageArray[2]
    seasonData.winter = percentageArray[3]

    // Convert strings to numbers
    const numbersArray = percentageArray.map(Number);

    // Create an array of objects containing the original index and value
    const indexedValues = numbersArray.map((value, index) => ({ value, index }));

    // sort the array to find the lighest and lowest value
    indexedValues.sort((a, b) => b.value - a.value);

    // Get the highest and lowest values
    const highestValue = indexedValues[0].value;
    const lowestValue = indexedValues[indexedValues.length - 1].value;

    const difference = 10;

    if (highestValue - lowestValue < difference) {
        // Set the background to the balance image
        setBackground(seasonImages.balancedImage.url, seasonImages.balancedImage.backgroundWidth);
    } else {
        // Set the background based on the highest value
        const highestIndex = indexedValues[0].index;

        switch (highestIndex) {
            case 0:
                setBackground(seasonImages.springImage.url, seasonImages.springImage.backgroundWidth);
                break;
            case 1:
                setBackground(seasonImages.summerImage.url, seasonImages.summerImage.backgroundWidth);
                break;
            case 2:
                setBackground(seasonImages.autumnImage.url, seasonImages.autumnImage.backgroundWidth);
                break;
            case 3:
                setBackground(seasonImages.winterImage.url, seasonImages.winterImage.backgroundWidth);
                break;
        }
    }

    await sleep (2000)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
async function fluctuate(range) {
    while (true) {
        await updateBalance([seasonData.spring * getRandomArbitrary(1-range,1+range),
                             seasonData.summer * getRandomArbitrary(1-range,1+range),
                             seasonData.autumn * getRandomArbitrary(1-range,1+range), 
                             seasonData.winter * getRandomArbitrary(1-range,1+range)], true)
        await sleep(400)
    }
}


// connects to google sheets and fetches the data to update the bars
async function loadSheetData() {
    const SHEETID = '1DkKHbezIZ6JiIocJJM0PqOH3MgwLdknwgzckR78dyhM'
    const SHEETNAME = 'API'
    const CELLRANGE = 'A2:B6'
    let  APIKEY = ''
    
    // gets the users api key from the input
    APIKEY = localStorage.getItem("api-key");

    url = 'https://sheets.googleapis.com/v4/spreadsheets/'+ SHEETID + '/values/'+ SHEETNAME + '!' + CELLRANGE + '?key=' + APIKEY;
    
    console.log('VISITING SHEET URL AT: ', url)
    
    fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
        // asigning spreadsheet data to variables
        newSpring = data.values[0][1]
        newSummer = data.values[1][1]
        newAutumn = data.values[2][1]
        newWinter = data.values[3][1]
        forecastMessage = data.values[4][1]
        
        // visualy updating the fetched data
        elements.forecastMessage.innerHTML = forecastMessage
        updateBalance([newSpring,newSummer,newAutumn,newWinter], false)
    }) 
}
function promptApiKey() {
    let apiKeyInput = prompt("enter your api key")
    if (apiKeyInput) {
        localStorage.setItem("api-key", apiKeyInput)
    }   
}


if (!localStorage.getItem("api-key")) {
    promptApiKey()
}

//loadSheetData()
//fluctuate(.05)
