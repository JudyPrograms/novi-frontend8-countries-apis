// text uit input field opslaan en doorgeven aan button event:
let textInput = null

const inputField = document.getElementById('input-field')
inputField.addEventListener('input', (event) => {
    updateInput(event)
})

const button = document.getElementById('search-button')
button.addEventListener('click', findCountryData)


// functie die door input field invullen wordt uitgevoerd:
function updateInput(event) {
    textInput = event.target.value;
}


// functie die door button click wordt uitgevoerd:
async function findCountryData() {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/name/${textInput}`)
        // console.log(result)

        const regionText = createRegionText(response)
        // console.log(infoText)

        const currencyText = createCurrencyText(response)
        // console.log(curString)

        const langText = createLanguageText(response)
        // console.log(langText)

        // info text in html invoegen:
        document.getElementById('country-data-text').innerHTML = `${regionText}<br/>${currencyText}<br/>${langText}`

        // vlag url in img element in html invoegen:
        if (document.contains(document.getElementById('flag-image'))) {
            // verwijder vlag van voorgaande zoekopdracht:
            document.getElementById('flag-image').remove()
        }
        const flagImage = document.createElement('img')
        document.getElementById('flag-image-div').appendChild(flagImage)
        const imageUrl = response.data[0].flag
        flagImage.setAttribute('src', imageUrl)
        flagImage.setAttribute('id', "flag-image")

        // titel in html invoegen:
        document.getElementById('country-title').textContent = response.data[0].name

        // input veld leegmaken:
        document.getElementById('input-field').value = null

    } catch(error) {
        // verwijder error van voorgaande zoekopdracht:
        if (document.contains(document.getElementById('country-not-found'))) {
            document.getElementById('country-not-found').remove()
        }

        // create error text en in html invoegen:
        let countryNotFound = document.createElement('p')
        const content = document.createTextNode("That country does not exist. Search again.")
        countryNotFound.appendChild(content)
        countryNotFound.setAttribute('id', "country-not-found")
        countryNotFound.setAttribute('class', "errorText")
        document.getElementById('country-data-text').appendChild(countryNotFound)
        console.error(error)
    }
}

function createRegionText (result) {
    // benodigde info opslaan en string maken:
    const countryName = result.data[0].name
    const subareaName = result.data[0].subregion
    const populationAmount = result.data[0].population.toLocaleString("de-DE")
    return `${countryName} is situated in ${subareaName}. It has a population of ${populationAmount} people.`
}

function createCurrencyText (result) {
    // aantal valuta checken en string maken:
    let curString
    if (result.data[0].currencies.length === 1) {
        curString = ` and you can pay with ${result.data[0].currencies[0].name}'s.`
    } else {
        curString = ` and you can pay with ${result.data[0].currencies[0].name}'s and ${result.data[0].currencies[1].name}'s.`
    }
    return `The capital is ${result.data[0].capital} ${curString}`
}

function createLanguageText (result) {
    let langText = "They speak "
    const languageObjects = result.data[0].languages
    for (const object of languageObjects) {
        const language = object.name
        switch (languageObjects.indexOf(object)) {
            case (languageObjects.length - 1):
                langText += language + "."
                break
            case (languageObjects.length - 2):
                langText += language + " and "
                break
            default:
                langText += language + ", "
        }
    }
    return langText
}



