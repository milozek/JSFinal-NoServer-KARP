const users = JSON.parse(localStorage.getItem("usersList")) || [];
const loginForm = document.querySelector("#loginForm");
const userTableBody = document.querySelector("#userTableBody");
const filterBtn = document.querySelector("#filterBtn");
const addBtn = document.querySelector("#addBtn");

class User {
  constructor(user) {
    this.gender = user.gender;
    this.nationality = user.nationality;
    this.intCode = user.intCode;
    this.service = user.service;
    this.start = user.start;
    this.id = user.id;
    this.dob = new Date(user.dob);

    if (/^[a-zA-Z]+$/.test(user.name)) {
      this.name = user.name;
    } else {
      throw (
        (new Error("Only letters"),
        swal("Error", "Name must include only letters", "error"))
      );
    }

    if (/^[a-zA-Z]+$/.test(user.lastname)) {
      this.lastname = user.lastname;
    } else {
      throw (
        (new Error("Only letters"),
        swal("Error", "Lastname must include only letters", "error"))
      );
    }

    if (/^[a-zA-Z]+$/.test(user.residence)) {
      this.residence = user.residence;
    } else {
      throw (
        (new Error("Only letters"),
        swal("Error", "Residence must include only letters", "error"))
      );
    }
    if (validateAge(this.dob)) {
      this.dob = user.dob;
    } else {
      throw (
        (new Error("Under 18"), swal("Error", "You must be over 18", "error"))
      );
    }

    if (/^\d+$/.test(user.phone)) {
      this.phone = user.phone;
    } else {
      throw (
        (new Error("Only numbers"),
        swal("Error", "Phone must include only numbers", "error"))
      );
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      this.email = user.email;
    } else {
      throw new Error("Invalid mail format");
    }
  }
  setId(users) {
    this.id = users.length;
  }
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

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
  ] = e.target.elements;

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
  });

  users.push(user);
  user.setId(users);

  console.log(users);
  store(users);
  newUser(users, userTableBody);
});

function store(users) {
  localStorage.setItem("usersList", JSON.stringify(users));
}

function newUser(elementsArray, htmlContainer) {
  htmlContainer.innerHTML = "";
  elementsArray.forEach((user) => {
    const newRow = document.createElement("tr");
    newRow.className = "listedUser";
    newRow.innerHTML = ` 
        <th scope="row">${user.id}</th>
        <td>${user.lastname}, ${user.name}</td>
        <td>${user.intCode} ${user.phone}</td>
        <td>${user.nationality}</td>
        <td>${user.service}</td>
        <td>${user.start}</td>   
    `;
    htmlContainer.appendChild(newRow);
  });
}

function validateAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

filterBtn.onclick = filterUser;

function filterUser() {
  const serviceSelect = document.querySelector("#serviceSelect");
  const monthSelect = document.querySelector("#monthSelect");

  const service = serviceSelect.value;
  const month = monthSelect.value;

  const filteredUsers = users.filter((item) => {
    if (service === "Select a service" && month === "Select a starting month") {
      return true;
    } else if (service === "Select a service") {
      return item.start === month;
    } else if (month === "Select a starting month") {
      return item.service === service;
    } else {
      return item.service === service && item.start === month;
    }
  });

  console.log(filteredUsers);
}

const paymentBtn = document.querySelector("#paymentBtn");
paymentBtn.addEventListener("click", () => {
  fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 2 },
        { id: 3, quantity: 1 },
      ],
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      return res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.error(e.error);
    });
});

const useJson = async () => {
  let response = await fetch("../scripts/data.json");
  let services = await response.json();
  console.log(services);
};

const coursesToggle = document.querySelector("#courses");
coursesToggle.onclick = useJson;
