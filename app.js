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
    balancedImage : "images/balanced.webp",
    springImage : "images/spring.jpg",
    summerImage : "images/summer.webp",
    autumnImage : "images/autumn.jpg",
    winterImage : "images/winter.jpg"
}

async function updateBalance(percentageArray, visualOnly) {
    for (let i = 0; i < elements.bars.length; i++) {
        let season = elements.bars[i]
        season.style.width = (percentageArray[i] / 2) + 'rem'
    }
    
    // update global percentages if not just visual
    if (!visualOnly) {
        
        seasons.spring = percentageArray[0]
        seasons.summer = percentageArray[1]
        seasons.autumn = percentageArray[2]
        seasons.winter = percentageArray[3]
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
        await sleep(10)
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
        
        updateBalance([newSpring,newSummer,newAutumn,newWinter])
    }) 
}

if (!localStorage.getItem("api-key")) {
    let apiKeyInput = prompt("enter your api key")
    localStorage.setItem("api-key", apiKeyInput)
}

loadSheetData()
fluctuate(.05)