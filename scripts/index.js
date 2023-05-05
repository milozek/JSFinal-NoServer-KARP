const users = JSON.parse(localStorage.getItem("usersList")) || []
const loginForm = document.querySelector("#loginForm")
const userTableBody = document.querySelector("#userTableBody")
const filterBtn = document.querySelector("#filterBtn")
const addBtn = document.querySelector("#addBtn")

class User {
    constructor(user) {
        this.gender = user.gender
        this.nationality = user.nationality
        this.intCode = user.intCode
        this.service = user.service
        this.start = user.start
        this.id = user.id
        this.dob = new Date(user.dob)

        if (/^[a-zA-Z]+$/.test(user.name)) {
            this.name = user.name
        } else {
            throw (
                (new Error("Only letters"),
                swal("Error", "Name must include only letters", "error"))
            )
        }

        if (/^[a-zA-Z]+$/.test(user.lastname)) {
            this.lastname = user.lastname
        } else {
            throw (
                (new Error("Only letters"),
                swal("Error", "Lastname must include only letters", "error"))
            )
        }

        if (/^[a-zA-Z]+$/.test(user.residence)) {
            this.residence = user.residence
        } else {
            throw (
                (new Error("Only letters"),
                swal("Error", "Residence must include only letters", "error"))
            )
        }
        if (validateAge(this.dob)) {
            this.dob = user.dob
        } else {
            throw (new Error("Under 18"), swal("Error", "You must be over 18", "error"))
        }

        if (/^\d+$/.test(user.phone)) {
            this.phone = user.phone
        } else {
            throw (
                (new Error("Only numbers"),
                swal("Error", "Phone must include only numbers", "error"))
            )
        }

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            this.email = user.email
        } else {
            throw new Error("Invalid mail format")
        }
    }
    setId(users) {
        this.id = users.length
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const [
        name,
        lastname,
        gender,
        dob,
        nationality,
        residence,
        intCode,
        phone,
        email,
        service,
        start,
    ] = e.target.elements

    const user = new User({
        name: name.value,
        lastname: lastname.value,
        gender: gender.value,
        dob: dob.value,
        nationality: nationality.value,
        residence: residence.value,
        intCode: intCode.value,
        phone: phone.value,
        email: email.value,
        service: service.value,
        start: start.value,
    })

    users.push(user)
    user.setId(users)

    console.log(users)
    store(users)
    newUser(users, userTableBody)
})

function store(users) {
    localStorage.setItem("usersList", JSON.stringify(users))
}

function newUser(elementsArray, htmlContainer) {
    htmlContainer.innerHTML = ""
    elementsArray.forEach((user) => {
        const newRow = document.createElement("tr")
        newRow.className = "listedUser"
        newRow.innerHTML = ` 
        <th scope="row">${user.id}</th>
        <td>${user.lastname}, ${user.name}</td>
        <td>${user.intCode} ${user.phone}</td>
        <td>${user.nationality}</td>
        <td>${user.service}</td>
        <td>${user.start}</td>   
    `
        htmlContainer.appendChild(newRow)
    })
}

function validateAge(dateString) {
    let today = new Date()
    let birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    let monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age >= 18
}

filterBtn.onclick = filterUser

function filterUser() {
    const serviceSelect = document.querySelector("#serviceSelect")
    const monthSelect = document.querySelector("#monthSelect")

    const service = serviceSelect.value
    const month = monthSelect.value

    const filteredUsers = users.filter((item) => {
        if (service === "Select a service" && month === "Select a starting month") {
            return true
        } else if (service === "Select a service") {
            return item.start === month
        } else if (month === "Select a starting month") {
            return item.service === service
        } else {
            return item.service === service && item.start === month
        }
    })

    console.log(filteredUsers)
}

const useJson = async () => {
    let response = await fetch("./scripts/data.json")
    let services = await response.json()
    console.log(services)
}

const coursesToggle = document.querySelector("#courses")
coursesToggle.onclick = useJson

async function etherToDollar(etherAmount) {
    const response = await fetch("https://api.coinbase.com/v2/exchange-rates?currency=ETH")
    const data = await response.json()
    const etherRate = parseFloat(data.data.rates.USD)
    const dollarAmount = etherAmount * etherRate
    return dollarAmount
}

const ethDollarDisplay = document.querySelector("#eth-usd")
const convertBtn = document.querySelector("#convert-btn")

async function getExchangeRate() {
    try {
        const dollarAmount = await etherToDollar(1)
        ethDollarDisplay.textContent = `ETH to USD converter: $${dollarAmount.toFixed(2)}`
        console.log("External call to API was triggered")
        exchangeRate = dollarAmount.toFixed(2)
        localStorage.setItem("exchangeRate", exchangeRate)
        localStorage.setItem("cachedTime", Date.now())
    } catch (error) {
        console.error(error)
    }
}
let exchangeRate = localStorage.getItem("exchangeRate")

convertBtn.addEventListener("click", () => {
    const cachedTime = localStorage.getItem("cachedTime")
    if (exchangeRate && cachedTime && Date.now() - cachedTime < 5 * 60 * 1000) {
        const timeDifference = Math.floor((Date.now() - cachedTime) / 1000)
        console.log(`$${exchangeRate} ${timeDifference}s ago`)
        ethDollarDisplay.innerHTML = `$${exchangeRate}<br>After 300 seconds you'll be able to update the exchange rate again.<br> Last update was ${timeDifference} seconds ago.`
    } else {
        getExchangeRate()
    }
})
