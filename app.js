elements = {
    bars : document.querySelectorAll('.bar'),
    totalBalance : document.querySelector('.totalBalance'),
    mainContent : document.querySelector('.main-content')
}
let seasons = {
    spring : 100,
    summer : 100,
    autumn : 100,
    winter : 100,
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

    seasons.spring = percentageArray[0]
    seasons.summer = percentageArray[1]
    seasons.autumn = percentageArray[2]
    seasons.winter = percentageArray[3]

    // Convert strings to numbers
    const numbersArray = percentageArray.map(Number);

    // Create an array of objects containing the original index and value
    const indexedValues = numbersArray.map((value, index) => ({ value, index }));

    // sort the array to find the lighest and lowest value
    indexedValues.sort((a, b) => b.value - a.value);

    // Get the highest and lowest values
    const highestValue = indexedValues[0].value;
    const lowestValue = indexedValues[indexedValues.length - 1].value;

    const diffirence = 10;

    if (highestValue - lowestValue < diffirence) {
        // Set the background to the balance image
        setBackground(seasons.balancedImage.url, seasons.balancedImage.backgroundWidth);
    } else {
        // Set the background based on the highest value
        const highestIndex = indexedValues[0].index;
        switch (highestIndex) {
            case 0:
                setBackground(seasons.springImage.url, seasons.springImage.backgroundWidth);
                break;
            case 1:
                setBackground(seasons.summerImage.url, seasons.summerImage.backgroundWidth);
                break;
            case 2:
                setBackground(seasons.autumnImage.url, seasons.autumnImage.backgroundWidth);
                break;
            case 3:
                setBackground(seasons.winterImage.url, seasons.winterImage.backgroundWidth);
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
        await updateBalance([seasons.spring * getRandomArbitrary(1-range,1+range),
                             seasons.summer * getRandomArbitrary(1-range,1+range),
                             seasons.autumn * getRandomArbitrary(1-range,1+range), 
                             seasons.winter * getRandomArbitrary(1-range,1+range)], true)
        await sleep(400)
    }
}


// connects to google sheets and fetches the data to update the bars
async function loadSheetData() {
    const SHEETID = '1DkKHbezIZ6JiIocJJM0PqOH3MgwLdknwgzckR78dyhM'
    const SHEETNAME = 'API'
    const CELLRANGE = 'A2:B5'
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
        newSpring = data.values[0][1]
        newSummer = data.values[1][1]
        newAutumn = data.values[2][1]
        newWinter = data.values[3][1]
        
        updateBalance([newSpring,newSummer,newAutumn,newWinter], false)
    }) 
}

if (!localStorage.getItem("api-key")) {
    let apiKeyInput = prompt("enter your api key")
    localStorage.setItem("api-key", apiKeyInput)
}

//loadSheetData()
fluctuate(.05)
