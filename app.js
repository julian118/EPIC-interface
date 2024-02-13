elements = {
    bars : document.querySelectorAll('.bar'),
    totalBalance : document.querySelector('.totalBalance'),
    mainContent : document.querySelector('.main-content')
}

async function updateBalance(percentageArray) {
    for (let i = 0; i < elements.bars.length; i++) {
        season = elements.bars[i]
        season.style.width = (percentageArray[i] / 2) + 'rem'

    }
    balanceScore = calculateBalanceScore(percentageArray)
    elements.totalBalance.innerText = 'balance: ' + balanceScore + '%'

    // update global percentages
    game.spring = percentageArray[0]
    game.summer = percentageArray[1]
    game.autumn = percentageArray[2]
    game.winter = percentageArray[3]

    await sleep (2000)
}

// gets the range between percentages
function calculateBalanceScore(barScoreArray) { 
  
    const minPercentage = Math.min(...barScoreArray)
    const maxPercentage = Math.max(...barScoreArray)

    const range = maxPercentage - minPercentage

    const balancedRange = 100 - range
    const balanceScore = (balancedRange / 100) * 100

    return balanceScore;
  }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
async function fluctuate() {
    while (true) {
        await updateBalance([game.spring * getRandomArbitrary(0.98,1.02),
                        game.summer * getRandomArbitrary(0.98,1.02),
                        game.fall * getRandomArbitrary(0.98,1.02), 
                        game.winter * getRandomArbitrary(0.98,1.02)])
        await sleep(300)
    }
}
let game = {
    spring : 40,
    summer : 88,
    autumn : 85,
    winter : 95,
}


// connects to google sheets and fetches the data to update the bars
async function loadSheetData() {
    const SHEETID = '1DkKHbezIZ6JiIocJJM0PqOH3MgwLdknwgzckR78dyhM'
    const SHEETNAME = 'API'
    const CELLRANGE = 'A2:B5'
    let  APIKEY = ''
    
    // temporary solution but since I dont want to get into the backend,
    // this seems like its the only way to hide my api key in the frontend.
    APIKEY = document.getElementById('KEY').value

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

loadSheetData()