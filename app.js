elements = {
    bars : document.querySelectorAll('.bar'),
    totalBalance : document.querySelector('.totalBalance'),
    mainContent : document.querySelector('.main-content')
}

async function updateBalance(percentageArray) {
    for (let i = 0; i < elements.bars.length; i++) {
        season = elements.bars[i]
        season.style.width = (percentageArray[i] / 2) + 'rem'
        season.innerHTML = Math.round(percentageArray[i]) + '%'

    }
    balanceScore = calculateBalanceScore(percentageArray)
    elements.totalBalance.innerText = 'balance: ' + balanceScore + '%'

    if (balanceScore < 70) {
        background = elements.mainContent.style.background
        switch (indexOfMax(percentageArray)) {
            case 0:
                elements.mainContent.style.background = game.springColor
                break
            case 1:
                elements.mainContent.style.background = game.summerColor
                break
            case 2: 
                elements.mainContent.style.background = game.autumnColor
                break
            case 3: 
                elements.mainContent.style.background = game.winterColor
                break
        } 
    game.spring = percentageArray[0]
    game.summer = percentageArray[1]
    game.fall = percentageArray[2]
    game.winter = percentageArray[3]
    
    } else {
        elements.mainContent.style.background = '#d2b2a0'
    }
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
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
async function fluctuate() {
    while (true) {
        await updateBalance([game.spring * getRandomArbitrary(0.98,1.02),
                        game.summer * getRandomArbitrary(0.98,1.02),
                        game.fall * getRandomArbitrary(0.98,1.02), 
                        game.winter * getRandomArbitrary(0.98,1.02)])
        await sleep(3000)
    }
}
let game = {
    spring : 40,
    summer : 88,
    fall : 85,
    winter : 95,
    springColor : '#75a165',
    summerColor : '#d2a865',
    autumnColor : '#b9684f',
    winterColor : '#85a7b6'
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
        newAutumn = data.values[1][1]
        newWinter = data.values[2][1]
        

        updateBalance([newSpring,newSummer,newAutumn,newWinter])
    })

    
}

loadSheetData()